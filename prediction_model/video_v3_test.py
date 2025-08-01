import cv2
import json
import os
import time
import logging
from datetime import datetime
from ultralytics.solutions import speed_estimation
import easyocr
import numpy as np
from collections import deque
import subprocess
from ultralytics import YOLO
import math

# initialize video capture
# rtsp_url = "rtsp://RoadsenseAdmin:RoadSense@172.20.10.5:554/stream1"
# cap = cv2.VideoCapture(rtsp_url)
video = "KAU7381.mp4"

cap = cv2.VideoCapture(video, cv2.CAP_FFMPEG)
assert cap.isOpened(), "Error reading video file."

fps = cap.get(cv2.CAP_PROP_FPS) or 20.0
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
# w, h, fps = (
#     int(cap.get(x))
#     for x in (1920, 1080, cv2.CAP_PROP_FPS)
# )
video_writer = cv2.VideoWriter(
    "predictions.mp4", cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h)
)

# speed estimator init
speed_estimator = speed_estimation.SpeedEstimator(
    # show=True,
    conf=0.4,
    fps=fps,
    meter_per_pixel=0.05,
    model="yolo11n_openvino_model",
    # region=speed_region,
    max_hist=20,
    show_conf=True,
    show_labels=True,
    line_width=3,
    classes=[2, 3, 5, 7],
)
plate_detector = YOLO("license_plate_detector_openvino_model")
ocr_reader = easyocr.Reader(["en"], gpu=False)
# params
frame_index = 0
SPEED_THRESHOLD = 10.0
COOLDOWN_FRAMES = 50
HORN_THRESHOLD = 3
HORN_WINDOW_SECONDS = 5
AUDIO_SAMPLE_RATE = 16000
AUDIO_BLOCK_DURATION = 0.5  # seconds
HORN_VOLUME_THRESHOLD = -45.0
AUDIO_CHUNK_SIZE = AUDIO_SAMPLE_RATE // 2
BYTES_PER_SAMPLE = 2
CHUNK_BYTES = AUDIO_CHUNK_SIZE * BYTES_PER_SAMPLE

horn_timestamps = deque()
last_horn_event_time = 0
current_frame_volume = 0.0

ffmpeg_audio_cmd = [
    "ffmpeg",
    "-i",
    video,
    "-vn",
    "-f",
    "s16le",
    "-acodec",
    "pcm_s16le",
    "-ac",
    "1",
    "-ar",
    str(AUDIO_SAMPLE_RATE),
    "-",
]

audio_process = subprocess.Popen(
    ffmpeg_audio_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, bufsize=10**8
)

# report output directory
output_dir = "../backend/storage/app/public/violation_images"
os.makedirs(output_dir, exist_ok=True)

# motion detection
motion_detector = cv2.createBackgroundSubtractorMOG2(
    history=100, varThreshold=50, detectShadows=False
)
motion_sensitivity = 5000

# logging config
log_file = "../run_predictions.log"
logging.basicConfig(
    filename=log_file,
    filemode="a",
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)

# trackers
logged_vehicles = {}
pending_saves = {}
pending_ids = set()
pending_horn_event = None


def trigger_horn_event(volume):
    global frame_index, pending_horn_event
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename_base = f"horn_event_{frame_index}_{timestamp}"
    json_path = os.path.join(output_dir, filename_base + ".json")
    image_path = os.path.join(output_dir, filename_base + ".jpg")

    event = {
        "custom_user_id": "0",
        "detected_at": datetime.now().isoformat(),
        "speed": "0",
        "plate_number": "N/A",
        "status": "flagged",
        "decibel_level": round(float(volume), 1),
        "updated_at": datetime.now().isoformat(),
        "created_at": datetime.now().isoformat(),
    }

    pending_horn_event = (event, json_path, image_path)


def read_audio_chunk(stream, chunk_size):
    raw_audio = stream.stdout.read(chunk_size)
    if not raw_audio:
        return None
    audio_data = np.frombuffer(raw_audio, np.int16).astype(np.float32) / 32768.0
    return audio_data


def process_audio_volume(audio_data):
    global horn_timestamps, last_horn_event_time, frame, frame_index, current_frame_volume

    volume = np.linalg.norm(audio_data) / len(audio_data)
    current_frame_volume = 20 * np.log10(volume + 1e-6)

    current_time = time.time()

    if current_frame_volume >= HORN_VOLUME_THRESHOLD:
        horn_timestamps.append(current_time)

    while horn_timestamps and current_time - horn_timestamps[0] > HORN_WINDOW_SECONDS:
        horn_timestamps.popleft()

    if (
        len(horn_timestamps) >= HORN_THRESHOLD
        and current_time - last_horn_event_time > HORN_WINDOW_SECONDS
    ):
        last_horn_event_time = current_time
        trigger_horn_event(current_frame_volume)


def detect_and_read_plate(image):
    try:
        plate_results = plate_detector(image, imgsz=640, verbose=False)[0]
        for box in plate_results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            plate_region = image[y1:y2, x1:x2]
            if plate_region.size == 0:
                continue

            # Preprocess
            gray = cv2.cvtColor(plate_region, cv2.COLOR_BGR2GRAY)
            bin_img = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 17, 3
            )

            # OCR
            ocr_results = ocr_reader.readtext(bin_img)
            valid_plates = []
            for bbox, text, conf in ocr_results:
                text = text.strip().upper()
                text = "".join(filter(str.isalnum, text))
                if 4 <= len(text) <= 12 and conf >= 0.3:
                    valid_plates.append((text, conf))

            if valid_plates:
                valid_plates.sort(key=lambda x: -x[1])
                best_text, best_conf = valid_plates[0]
                return best_text, (x1, y1, x2, y2), round(best_conf * 100, 1)

    except Exception as e:
        logging.error(f"LPR failed: {e}")
    return None, None, None


while True:
    success, frame = cap.read()
    if not success:
        logging.warning(f"[WARNING] Frame read failed at index {frame_index}.")
        break

    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    fg_mask = motion_detector.apply(gray_frame)
    motion_pixels = cv2.countNonZero(fg_mask)

    samples_per_frame = AUDIO_SAMPLE_RATE / fps
    chunk_bytes_per_frame = int(samples_per_frame) * BYTES_PER_SAMPLE

    audio_data = read_audio_chunk(audio_process, chunk_bytes_per_frame)
    if audio_data is not None:
        process_audio_volume(audio_data)

        # Overlay volume text
    label_text = f"Volume: {(current_frame_volume):.3f}"
    cv2.putText(
        frame,
        label_text,
        (20, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.0,
        (0, 255, 255),
        2,
        cv2.LINE_AA,
    )

    if motion_pixels > motion_sensitivity:
        logging.info(
            f"Motion detected on frame {frame_index} ({motion_pixels} pixels changed)."
        )

        results = speed_estimator(frame)
        license_plate_text, plate_bbox, plate_conf = detect_and_read_plate(frame)

        if plate_bbox:
            x1, y1, x2, y2 = plate_bbox
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)

            gray_plate = cv2.cvtColor(frame[y1:y2, x1:x2], cv2.COLOR_BGR2GRAY)
            plate_bin = cv2.adaptiveThreshold(
                gray_plate,
                255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY_INV,
                15,
                4,
            )
            plate_bin_bgr = cv2.cvtColor(plate_bin, cv2.COLOR_GRAY2BGR)

            if plate_bin_bgr.size > 0:
                overlay_height = 60
                overlay_width = int((x2 - x1) * (overlay_height / max(y2 - y1, 1)))
                resized_bin = cv2.resize(plate_bin_bgr, (overlay_width, overlay_height))

                overlay_top = max(y1 - overlay_height - 3, 0)
                overlay_left = max(x1, 0)
                overlay_right = min(overlay_left + overlay_width, frame.shape[1])

                if overlay_right - overlay_left == resized_bin.shape[1]:
                    frame[
                        overlay_top : overlay_top + overlay_height,
                        overlay_left:overlay_right,
                    ] = resized_bin

                    # Display plates for each track
                    for track_id in speed_estimator.spd.keys():
                        # Display Current Plate
                        if license_plate_text:
                            cv2.putText(
                                frame,
                                f"Current: {license_plate_text} ({plate_conf})",
                                (overlay_left, overlay_top - 10),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                0.7,
                                (0, 255, 0),  # Yellow
                                2,
                                cv2.LINE_AA,
                            )

        for track_id in list(pending_saves.keys()):
            event, json_path, image_path = pending_saves[track_id]
            cv2.imwrite(image_path, frame)
            with open(json_path, "w") as f:
                json.dump(event, f, indent=4)
            logging.info(f"Speed Violation Logged: {event}")
            logged_vehicles[track_id] = frame_index
            del pending_saves[track_id]
            pending_ids.discard(track_id)

        for track_id, speed in speed_estimator.spd.items():

            if speed > SPEED_THRESHOLD:
                if track_id in pending_ids:
                    continue

                last_logged = logged_vehicles.get(track_id)
                if (
                    last_logged is not None
                    and (frame_index - last_logged) <= COOLDOWN_FRAMES
                ):
                    continue

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename_base = f"event_{frame_index}_id{track_id}_{timestamp}"
                json_path = os.path.join(output_dir, filename_base + ".json")
                image_path = os.path.join(output_dir, filename_base + ".jpg")

                event = {
                    "custom_user_id": "0",
                    "detected_at": datetime.now().isoformat(),
                    "speed": round(float(speed), 2),
                    "plate_number": license_plate_text or "unreadable",
                    "status": "flagged",
                    "decibel_level": round(float(current_frame_volume), 1),
                    "updated_at": datetime.now().isoformat(),
                    "created_at": datetime.now().isoformat(),
                }

                pending_saves[track_id] = (event, json_path, image_path)
                pending_ids.add(track_id)

        if pending_horn_event:
            event, json_path, image_path = pending_horn_event
            cv2.imwrite(image_path, frame)
            with open(json_path, "w") as f:
                json.dump(event, f, indent=4)
            logging.info(f"Horn Event Logged: {event}")
            pending_horn_event = None

    else:
        logging.debug(
            f"No significant motion or inference skipped at frame {frame_index}."
        )

    video_writer.write(frame)

    frame_index += 1

cap.release()
audio_process.terminate()
audio_process.wait()
video_writer.release()
# cv2.destroyAllWindows()

# mux
final_output = "final_output_with_audio.mp4"
ffmpeg_mux_cmd = [
    "ffmpeg",
    "-y",
    "-i",
    "predictions.mp4",
    "-i",
    video,
    "-c",
    "copy",
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-shortest",
    final_output,
]

try:
    subprocess.run(ffmpeg_mux_cmd, check=True)
    logging.info("Final video with audio muxed successfully.")
except subprocess.CalledProcessError as e:
    logging.error(f"Failed to mux audio: {e}")
