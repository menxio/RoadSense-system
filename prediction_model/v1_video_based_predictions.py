import cv2
import json
import os
import time
import logging
from datetime import datetime
from ultralytics.solutions import speed_estimation
import easyocr
import sounddevice as sd
import numpy as np
from collections import deque
import subprocess

# initialize video capture
# rtsp_url = "rtsp://RoadsenseAdmin:RoadSense@172.20.10.5:554/stream1"
# cap = cv2.VideoCapture(rtsp_url)
cap = cv2.VideoCapture("video_main.mp4")
assert cap.isOpened(), "Error reading video file."

w, h, fps = (
    int(cap.get(x))
    for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS)
)

# w, h, fps = (
#     int(cap.get(x))
#     for x in (1920, 1080, cv2.CAP_PROP_FPS)
# )
video_writer = cv2.VideoWriter(
    "predictions.mp4", cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h)
)

# estimation region
speed_region = [(950, 1050), (950, 150)]  # bottom-left & top-left points on frame

# speed estimator init
speed_estimator = speed_estimation.SpeedEstimator(
    # show=True,
    conf=0.4,
    fps=fps,
    meter_per_pixel=0.05,
    model="yolo11n_openvino_model",
    # region=speed_region,
    max_hist=10,
    show_conf=True,
    show_labels=True,
    line_width=3,
    classes=[2, 3, 5, 7],
)
# OCR reader init
ocr_reader = easyocr.Reader(["en"], gpu=False)

# params
frame_index = 0
SPEED_THRESHOLD = 20.0
COOLDOWN_FRAMES = 200
HORN_THRESHOLD = 3
HORN_WINDOW_SECONDS = 5
AUDIO_SAMPLE_RATE = 16000
AUDIO_BLOCK_DURATION = 0.5  # seconds
HORN_VOLUME_THRESHOLD = 0.008
AUDIO_CHUNK_SIZE = AUDIO_SAMPLE_RATE // 2
BYTES_PER_SAMPLE = 2
CHUNK_BYTES = AUDIO_CHUNK_SIZE * BYTES_PER_SAMPLE

horn_timestamps = deque()
last_horn_event_time = 0
current_frame_volume = 0.0

ffmpeg_audio_cmd = [
    "ffmpeg",
    "-i", "video_main.mp4",
    "-vn",
    "-f", "s16le",
    "-acodec", "pcm_s16le",
    "-ac", "1",
    "-ar", str(AUDIO_SAMPLE_RATE),
    "-"
]

audio_process = subprocess.Popen(
    ffmpeg_audio_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, bufsize=10**8
)

# report output directory
output_dir = "../violation_logging/speed_events"
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


def trigger_horn_event(volume):
    global frame, frame_index
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename_base = f"horn_event_{frame_index}_{timestamp}"
        json_path = os.path.join(output_dir, filename_base + ".json")
        image_path = os.path.join(output_dir, filename_base + ".jpg")
        cv2.imwrite(image_path, frame)

        event = {
            "custom_user_id": 0,
            "detected_at": datetime.now().isoformat(),
            "speed": None,
            "plate_number": None,
            "status": "flagged",
            "decibel_level": float(volume),
            "updated_at": datetime.now().isoformat(),
            "created_at": datetime.now().isoformat(),
        }

        with open(json_path, "w") as f:
            json.dump(event, f, indent=4)
        logging.info(f"Horn Event Logged: {event}")
    except Exception as e:
        logging.error(f"Failed to log horn event: {e}")


def read_audio_chunk(stream, chunk_size):
    raw_audio = stream.stdout.read(chunk_size)
    if not raw_audio:
        return None
    audio_data = np.frombuffer(raw_audio, np.int16).astype(np.float32) / 32768.0
    return audio_data


def process_audio_volume(audio_data):
    global horn_timestamps, last_horn_event_time, frame, frame_index, current_frame_volume

    volume = np.linalg.norm(audio_data) / len(audio_data)
    current_frame_volume = volume  # Store for overlay

    current_time = time.time()

    if volume >= HORN_VOLUME_THRESHOLD:
        horn_timestamps.append(current_time)

    while horn_timestamps and current_time - horn_timestamps[0] > HORN_WINDOW_SECONDS:
        horn_timestamps.popleft()

    if (
        len(horn_timestamps) >= HORN_THRESHOLD
        and current_time - last_horn_event_time > HORN_WINDOW_SECONDS
    ):
        last_horn_event_time = current_time
        trigger_horn_event(volume)


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
    label_text = f"Volume: {current_frame_volume:.3f}"
    cv2.putText(
        frame,
        label_text,
        (20, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.0,
        (0, 255, 255),
        2,
        cv2.LINE_AA
    )

    if motion_pixels > motion_sensitivity:
        logging.info(
            f"Motion detected on frame {frame_index} ({motion_pixels} pixels changed)."
        )

        # speed estimation
        results = speed_estimator(frame)

        # save reports if any
        for track_id in list(pending_saves.keys()):
            event, json_path, image_path = pending_saves[track_id]
            cv2.imwrite(image_path, frame)
            with open(json_path, "w") as f:
                json.dump(event, f, indent=4)
            logging.info(f"Speed Violation Logged: {event}")
            logged_vehicles[track_id] = frame_index
            del pending_saves[track_id]
            pending_ids.discard(track_id)

        # check speed violations
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

                frame_height, frame_width = frame.shape[:2]
                crop_start = int(frame_height * 0.75)  # Bottom 25% of the frame
                vehicle_crop = frame[crop_start:frame_height, 0:frame_width]

                license_plate_text = None

                if vehicle_crop.size != 0:
                    try:
                        # perform ocr
                        gray_vehicle = cv2.cvtColor(vehicle_crop, cv2.COLOR_BGR2GRAY)
                        ocr_results = ocr_reader.readtext(gray_vehicle)

                        for result in ocr_results:
                            text = result[1].strip()
                            logging.info(f"Text Detected: {text}")
                            if 5 <= len(text) <= 12:
                                license_plate_text = text
                                logging.info(f"OCR License Plate Detected: {text}")
                                break
                    except Exception as e:
                        logging.error(f"OCR failed on frame {frame_index}: {e}")

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename_base = f"event_{frame_index}_id{track_id}_{timestamp}"
                json_path = os.path.join(output_dir, filename_base + ".json")
                image_path = os.path.join(output_dir, filename_base + ".jpg")

                # Create event data
                event = {
                    "custom_user_id": 0,
                    "detected_at": datetime.now().isoformat(),
                    "speed": round(float(speed), 2),
                    "plate_number": license_plate_text or "unreadable",
                    "status": "flagged",
                    "decibel_level": 0,
                    "updated_at": datetime.now().isoformat(),
                    "created_at": datetime.now().isoformat(),
                }

                # Schedule event for saving next loop
                pending_saves[track_id] = (event, json_path, image_path)
                pending_ids.add(track_id)

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
cv2.destroyAllWindows()


final_output = "final_output_with_audio.mp4"
ffmpeg_mux_cmd = [
    "ffmpeg",
    "-y",  # Overwrite output if exists
    "-i", "predictions.mp4",         # Video-only file
    "-i", "video_main.mp4",          # Original file with audio
    "-c", "copy",
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-shortest",
    final_output
]

try:
    subprocess.run(ffmpeg_mux_cmd, check=True)
    logging.info("Final video with audio muxed successfully.")
except subprocess.CalledProcessError as e:
    logging.error(f"Failed to mux audio: {e}")
    