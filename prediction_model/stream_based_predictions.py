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
from ultralytics.solutions import speed_estimation
from ultralytics import YOLO
import easyocr
from collections import deque

# Configuration
rtsp_url = "rtsp://roadsense:roadsense@192.168.1.6:554/stream1"
AUDIO_SAMPLE_RATE = 16000
AUDIO_BLOCK_DURATION = 0.5
HORN_VOLUME_THRESHOLD = 0.8
BYTES_PER_SAMPLE = 2
AUDIO_CHUNK_SIZE = int(AUDIO_SAMPLE_RATE * AUDIO_BLOCK_DURATION)
CHUNK_BYTES = AUDIO_CHUNK_SIZE * BYTES_PER_SAMPLE

# Thresholds
SPEED_THRESHOLD = 15.0
COOLDOWN_FRAMES = 200
HORN_THRESHOLD = 3
HORN_WINDOW_SECONDS = 5
motion_sensitivity = 5000

# State
horn_timestamps = deque()
last_horn_event_time = 0
current_frame_volume = 0.0
frame_index = 0
running = True

# Init logging
log_file = "../run_predictions.log"
logging.basicConfig(
    filename=log_file,
    filemode="a",
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.DEBUG,
)

# Init directories
output_dir = "../violation_logging/speed_events"
os.makedirs(output_dir, exist_ok=True)

# Init models
plate_detector = YOLO("license_plate_detector_openvino_model")
ocr_reader = easyocr.Reader(["en"], gpu=False)
logged_vehicles = {}
pending_saves = {}
pending_ids = set()

# Start OpenCV video
cap = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
if not cap.isOpened():
    raise RuntimeError("Failed to open RTSP stream")

fps = cap.get(cv2.CAP_PROP_FPS) or 20.0
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# Init speed estimator
speed_estimator = speed_estimation.SpeedEstimator(
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

# Init motion detector
motion_detector = cv2.createBackgroundSubtractorMOG2(
    history=100, varThreshold=50, detectShadows=False
)


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
            "speed": round(float(speed), 2),
            "plate_number": violation_plate_text or "unreadable",
            "status": "flagged",
            "decibel_level": math.trunc(round(float(volume), 3) * 1000) / 10,
            "updated_at": datetime.now().isoformat(),
            "created_at": datetime.now().isoformat(),
        }

        with open(json_path, "w") as f:
            json.dump(event, f, indent=4)
        logging.info(f"Horn Event Logged: {event}")
    except Exception as e:
        logging.error(f"Failed to log horn event: {e}")


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


def audio_loop():
    global current_frame_volume, last_horn_event_time, horn_timestamps, running

    ffmpeg_audio_cmd = [
        "ffmpeg",
        "-rtsp_transport",
        "tcp",
        "-i",
        rtsp_url,
        "-vn",
        "-f",
        "s16le",
        "-acodec",
        "pcm_s16le",
        "-ac",
        "1",
        "-ar",
        str(AUDIO_SAMPLE_RATE),
        "-loglevel",
        "quiet",
        "-",
    ]

    proc = subprocess.Popen(
        ffmpeg_audio_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL
    )

    while running:
        raw_audio = proc.stdout.read(CHUNK_BYTES)
        if not raw_audio:
            logging.warning("No audio data received.")
            break

        audio_np = np.frombuffer(raw_audio, dtype=np.int16).astype(np.float32) / 32768.0
        volume = (np.linalg.norm(audio_np) / len(audio_np)) * 1000
        current_frame_volume = volume

        logging.debug(f"[AUDIO] Volume: {volume:.2f}")
        now = time.time()

        if volume >= HORN_VOLUME_THRESHOLD:
            logging.info(f"[AUDIO] Volume threshold exceeded (volume={volume:.2f})")
            horn_timestamps.append(now)

        while horn_timestamps and now - horn_timestamps[0] > HORN_WINDOW_SECONDS:
            horn_timestamps.popleft()

        if (
            len(horn_timestamps) >= HORN_THRESHOLD
            and now - last_horn_event_time > HORN_WINDOW_SECONDS
        ):
            last_horn_event_time = now
            logging.info(f"[AUDIO] Horn event triggered (volume={volume:.2f})")
            trigger_horn_event(volume)

    proc.terminate()
    proc.wait()
    logging.info("Audio stream closed.")


# Start audio thread
audio_thread = threading.Thread(target=audio_loop, daemon=True)
audio_thread.start()

# Main loop
while True:
    ret, frame = cap.read()
    if not ret:
        logging.warning(f"[WARNING] Frame read failed at index {frame_index}.")
        break

    if frame_index % 3 == 1:
        frame_index += 1
        continue

    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    fg_mask = motion_detector.apply(gray_frame)
    motion_pixels = cv2.countNonZero(fg_mask)

    label_text = f"Volume: {current_frame_volume:.3f}"
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

                violation_plate_text, _ = detect_and_read_plate(frame)

                event = {
                    "custom_user_id": 0,
                    "detected_at": datetime.now().isoformat(),
                    "speed": round(float(speed), 2),
                    "plate_number": violation_plate_text or "unreadable",
                    "status": "flagged",
                    "decibel_level": math.trunc(
                        round(float(current_frame_volume), 3) * 1000
                    )
                    / 10,
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

# Cleanup
running = False
cap.release()
cv2.destroyAllWindows()
audio_thread.join()
logging.info("Processing terminated.")
