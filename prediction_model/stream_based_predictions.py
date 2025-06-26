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

rtsp_url = "rtsp://RoadsenseAdmin:RoadSense@172.20.10.5:554/stream1"

ffmpeg_video_cmd = [
    "ffmpeg",
    "-rtsp_transport", "tcp",
    "-i", rtsp_url,
    "-f", "image2pipe",
    "-pix_fmt", "bgr24",
    "-vcodec", "rawvideo",
    "-"
]

video_process = subprocess.Popen(
    ffmpeg_video_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, bufsize=10**8
)

w, h, fps = 1920, 1080, 20  # Set resolution and FPS manually or probe with ffprobe
frame_size = w * h * 3

# speed estimator init
speed_estimator = speed_estimation.SpeedEstimator(
    # show=True,
    conf=0.4,
    fps=fps,
    meter_per_pixel=0.05,
    model="yolo11n_openvino_model",
    max_hist=10,
    show_conf=True,
    show_labels=True,
    line_width=3,
    classes=[2, 3, 5, 7],
)
plate_detector = YOLO("license_plate_detector_openvino_model") 
ocr_reader = easyocr.Reader(["en"], gpu=False)

# params
frame_index = 0
SPEED_THRESHOLD = 15.0
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
    "-i", rtsp_url,
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

def detect_and_read_plate(image):
    try:
        plate_results = plate_detector(image, verbose=False)[0]
        for box in plate_results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            plate_region = image[y1:y2, x1:x2]

            if plate_region.size == 0:
                continue

            gray_plate = cv2.cvtColor(plate_region, cv2.COLOR_BGR2GRAY)
            ocr_results = ocr_reader.readtext(gray_plate)

            for result in ocr_results:
                text = result[1].strip()
                if 5 <= len(text) <= 12:
                    return text, (x1, y1, x2, y2)
    except Exception as e:
        logging.error(f"LPR failed: {e}")
    return None, None

while True:    
    raw_frame = video_process.stdout.read(frame_size)
    if len(raw_frame) != frame_size:
        logging.warning(f"[WARNING] Frame read failed at index {frame_index}.")
        break
    
    if(frame_index % 2 == 1):
        frame_index + 1
        continue
    
    frame = np.frombuffer(raw_frame, np.uint8).reshape((h, w, 3))


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

        results = speed_estimator(frame)
        license_plate_text, plate_bbox = detect_and_read_plate(frame)

        if plate_bbox:
            x1, y1, x2, y2 = plate_bbox
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)

            if license_plate_text:
                cv2.putText(
                    frame,
                    license_plate_text,
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.9,
                    (0, 255, 0),
                    2,
                    cv2.LINE_AA
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
                    if last_logged is not None and (frame_index - last_logged) <= COOLDOWN_FRAMES:
                        continue

                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filename_base = f"event_{frame_index}_id{track_id}_{timestamp}"
                    json_path = os.path.join(output_dir, filename_base + ".json")
                    image_path = os.path.join(output_dir, filename_base + ".jpg")

                    violation_plate_text, _ = detect_and_read_plate(frame)

                    event = {
                        "custom_user_id": 0,
                        "detected_at": datetime.now().isoformat(),
                        "speed": round(float(speed), 2),
                        "plate_number": violation_plate_text or "unreadable",
                        "status": "flagged",
                        "decibel_level": 0,
                        "updated_at": datetime.now().isoformat(),
                        "created_at": datetime.now().isoformat(),
                    }

                    pending_saves[track_id] = (event, json_path, image_path)
                    pending_ids.add(track_id)

    else:
        logging.debug(
            f"No significant motion or inference skipped at frame {frame_index}."
        )


    frame_index += 1

video_process.terminate()
video_process.wait()
audio_process.terminate()
audio_process.wait()
cv2.destroyAllWindows()