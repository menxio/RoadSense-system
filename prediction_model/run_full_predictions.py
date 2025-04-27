import cv2
import json
import os
import time
import logging
from datetime import datetime
from ultralytics.solutions import speed_estimation
import easyocr

# initialize video capture
cap = cv2.VideoCapture(f"rtsp://RoadsenseAdmin:RoadSense@172.20.10.5:554/stream1")
# cap = cv2.VideoCapture("training_5.mp4")
assert cap.isOpened(), "Error reading video file."

w, h, fps = (
    int(cap.get(x))
    for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS)
)
# video_writer = cv2.VideoWriter(
#     "predictions.mp4", cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h)
# )

# estimation region
speed_region = [(950, 1050), (950, 150)]  # bottom-left & top-left points on frame

# speed estimator init
speed_estimator = speed_estimation.SpeedEstimator(
    show=True,
    conf=0.4,
    model="yolo11n_ncnn_model",
    region=speed_region,
    line_width=2,
    classes=[2, 3, 5, 7],
)

# OCR reader init
ocr_reader = easyocr.Reader(["en"], gpu=False)

# params
frame_index = 0
SPEED_THRESHOLD = 10.0
COOLDOWN_FRAMES = 200

# report output directory
output_dir = "../violation_logging/speed_events"
os.makedirs(output_dir, exist_ok=True)

# motion detection 
motion_detector = cv2.createBackgroundSubtractorMOG2(
    history=100, varThreshold=50, detectShadows=False
)
motion_sensitivity = 40000

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

while True:
    success, frame = cap.read()
    if not success:
        logging.warning(f"[WARNING] Frame read failed at index {frame_index}.")
        break

    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    fg_mask = motion_detector.apply(gray_frame)
    motion_pixels = cv2.countNonZero(fg_mask)

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
                    "license_plate": license_plate_text or "unreadable",
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

    # video_writer.write(frame)

    frame_index += 1

cap.release()
# video_writer.release()
# cv2.destroyAllWindows()
