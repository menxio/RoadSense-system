import cv2
import json
import os
import time
import logging
import math
import numpy as np
import subprocess
import threading
from datetime import datetime
from collections import deque
from ultralytics.solutions import speed_estimation
from ultralytics import YOLO
import easyocr

# === Configuration ===
rtsp_url = "rtsp://localhost:8554/cam"
AUDIO_SAMPLE_RATE = 8000
AUDIO_BLOCK_DURATION = 0.5
HORN_VOLUME_THRESHOLD = -50.0
BYTES_PER_SAMPLE = 2
AUDIO_CHUNK_SIZE = int(AUDIO_SAMPLE_RATE * AUDIO_BLOCK_DURATION)
CHUNK_BYTES = int(AUDIO_SAMPLE_RATE * AUDIO_BLOCK_DURATION * BYTES_PER_SAMPLE)

SPEED_THRESHOLD = 10.0
COOLDOWN_FRAMES = 50
HORN_THRESHOLD = 3
HORN_WINDOW_SECONDS = 5
motion_sensitivity = 10000
FRAME_SKIP_INTERVAL = 3

# === State ===
horn_timestamps = deque()
last_horn_event_time = 0
current_frame_volume = 0.0
frame_index = 0
running = True
logged_vehicles = {}
pending_saves = {}
pending_ids = set()
pending_horn_event = None
# === Logging ===
log_file = "../run_predictions.log"
logging.basicConfig(
    filename=log_file,
    filemode="a",
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.DEBUG,
)

# === Directories ===
output_dir = "../backend/storage/app/public/violation_images"
os.makedirs(output_dir, exist_ok=True)

# === Models ===
plate_detector = YOLO("license_plate_detector_openvino_model")
ocr_reader = easyocr.Reader(["en"], gpu=False)
cap = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
assert cap.isOpened(), "Failed to open RTSP stream."

fps = cap.get(cv2.CAP_PROP_FPS) or 20.0
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

speed_estimator = speed_estimation.SpeedEstimator(
    conf=0.4,
    show=False,
    fps=fps,
    meter_per_pixel=0.05,
    model="yolo11n_openvino_model",
    max_hist=10,
    show_conf=True,
    show_labels=True,
    line_width=3,
    classes=[2, 3, 5, 7],
)

motion_detector = cv2.createBackgroundSubtractorMOG2(
    history=100, varThreshold=50, detectShadows=False
)


def trigger_horn_event(volume):
    global frame, frame_index, pending_horn_event
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_name = f"horn_event_{frame_index}_{timestamp}"
    json_path = os.path.join(output_dir, base_name + ".json")
    image_path = os.path.join(output_dir, base_name + ".jpg")

    event = {
        "custom_user_id": "0",
        "detected_at": datetime.now().isoformat(),
        "speed": 0,
        "plate_number": "N/A",
        "status": "flagged",
        "decibel_level": round(float(volume), 1),
        "updated_at": datetime.now().isoformat(),
        "created_at": datetime.now().isoformat(),
    }

    pending_horn_event = (event, json_path, image_path)


def detect_and_read_plate(image):
    try:
        results = plate_detector(image, imgsz=640, verbose=False)[0]
        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            region = image[y1:y2, x1:x2]
            if region.size == 0:
                continue
            gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
            bin_img = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 17, 3
            )
            ocr_results = ocr_reader.readtext(bin_img)
            valid_plates = []
            for _, text, conf in ocr_results:
                text = text.strip().upper()
                text = "".join(filter(str.isalnum, text))
                if 4 <= len(text) <= 12 and conf >= 0.3:
                    valid_plates.append((text, conf))
            if valid_plates:
                valid_plates.sort(key=lambda x: -x[1])
                return valid_plates[0][0], (x1, y1, x2, y2)
    except Exception as e:
        logging.error(f"LPR failed: {e}")
    return None, None


def audio_loop():
    global current_frame_volume, last_horn_event_time, horn_timestamps, running
    cmd = [
        "ffmpeg",
        "-rtsp_transport",
        "tcp",
        "-i",
        rtsp_url,
        "-vn",
        "-acodec",
        "pcm_s16le",
        "-f",
        "s16le",
        "-ac",
        "1",
        "-ar",
        "8000",
        "-loglevel",
        "error",
        "-",
    ]

    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    while running:
        raw = proc.stdout.read(CHUNK_BYTES)
        if not raw:
            stderr_output = proc.stderr.read().decode(errors="ignore")
            logging.error(f"No audio data. FFmpeg stderr: {stderr_output}")
            break
        audio_np = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
        volume = 20 * np.log10(np.linalg.norm(audio_np) / len(audio_np) + 1e-6)
        current_frame_volume = volume

        now = time.time()
        if volume >= HORN_VOLUME_THRESHOLD:
            horn_timestamps.append(now)
        while horn_timestamps and now - horn_timestamps[0] > HORN_WINDOW_SECONDS:
            horn_timestamps.popleft()
        if (
            len(horn_timestamps) >= HORN_THRESHOLD
            and now - last_horn_event_time > HORN_WINDOW_SECONDS
        ):
            last_horn_event_time = now
            trigger_horn_event(volume)
    proc.terminate()
    proc.wait()
    logging.info("Audio thread stopped.")


audio_thread = threading.Thread(target=audio_loop, daemon=True)
audio_thread.start()

while True:
    ret, frame = cap.read()
    if not ret:
        logging.warning(f"Frame read failed at index {frame_index}")
        break

    if frame_index % FRAME_SKIP_INTERVAL != 0:
        frame_index += 1
        continue

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    fg_mask = motion_detector.apply(gray)
    motion_pixels = cv2.countNonZero(fg_mask)

    cv2.putText(
        frame,
        f"Volume: {current_frame_volume:.2f} dB",
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
        plate_text, bbox = detect_and_read_plate(frame)

        if bbox:
            x1, y1, x2, y2 = bbox
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)

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
                if last_logged and frame_index - last_logged < COOLDOWN_FRAMES:
                    continue

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                base_name = f"event_{frame_index}_id{track_id}_{timestamp}"
                json_path = os.path.join(output_dir, base_name + ".json")
                image_path = os.path.join(output_dir, base_name + ".jpg")

                event = {
                    "custom_user_id": "0",
                    "detected_at": datetime.now().isoformat(),
                    "speed": round(float(speed), 2),
                    "plate_number": plate_text or "unreadable",
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
    frame_index += 1

running = False
cap.release()
cv2.destroyAllWindows()
audio_thread.join()
logging.info("Process finished.")
