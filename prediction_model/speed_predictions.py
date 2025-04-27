import cv2
import json
import os
from datetime import datetime
from ultralytics.solutions import speed_estimation
import time
import logging

# Initialize video capture
# cap = cv2.VideoCapture("training_4.mp4")
# f = open("../RTSP_IP", "r")
# RTSP_IP = f.read()
cap = cv2.VideoCapture(f"rtsp://RoadsenseAdmin:RoadSense@192.168.1.11:554/stream1")

assert cap.isOpened(), "Error reading video file"

# Video properties
w, h, fps = (
    int(cap.get(x))
    for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS)
)
video_writer = cv2.VideoWriter(
    "predictions.mp4", cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h)
)

# Vertical Line
speed_region = [(950, 1000), (950, 150)]  # bl  # tl


# Vertical region
# speed_region = [
# (750, 1000), #bl
# (1200, 1000), #br
# (1200, 150), #tr/
# (750, 150) #tl
# ]

# Horizontal region
# speed_region = [
# (300, 500),
# (1650, 500),
# (1650, 250),
# (300, 250)
# ]

# Initialize speed estimator
speed_estimator = speed_estimation.SpeedEstimator(
    show=True,
    conf=0.4,
    model="yolo11n_ncnn_model",
    region=speed_region,
    line_width=2,
    classes=[2, 3, 5, 7],
)

# Parameters
frame_index = 0
SPEED_THRESHOLD = 35.0
COOLDOWN_FRAMES = 200
INFERENCE_INTERVAL = 1

# Output directory
output_dir = "../violation_logging/speed_events"
motion_detector = cv2.createBackgroundSubtractorMOG2(
    history=100, varThreshold=50, detectShadows=False
)
motion_sensitivity = 40000
os.makedirs(output_dir, exist_ok=True)

# Logs
log_file = "../run_predictions.log"
logging.basicConfig(
    filename=log_file,
    filemode="a",
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)

# Global trackers
logged_vehicles = {}  # Cooldown tracker
pending_saves = {}  # Events to save next frame
pending_ids = set()  # Fast check for scheduled vehicles


# while cap.isOpened():
while True:
    success, frame = cap.read()
    if not success:
        logging.warning(
            f"[WARNING] Frame read failed at index {frame_index}. Attempting reconnect..."
        )
        cap.release()
        try:
            cap = open_stream_with_retry(gst_pipeline)
            continue
        except RuntimeError as e:
            logging.error(str(e))
            break

    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    fg_mask = motion_detector.apply(gray_frame)
    motion_pixels = cv2.countNonZero(fg_mask)

    # if motion_pixels > motion_sensitivity and (frame_index % INFERENCE_INTERVAL == 0):
    if motion_pixels > motion_sensitivity:
        logging.info(
            f"Motion detected on frame {frame_index} ({motion_pixels} pixels changed)"
        )

        # Run speed estimation
        results = speed_estimator(frame)
        # video_writer.write(results.plot_im)

        # Save pending events for violations in the next frame
        for track_id in list(pending_saves.keys()):
            event, json_path, image_path = pending_saves[track_id]
            # Save current (now next) frame with annotations
            cv2.imwrite(image_path, frame)  # Save the frame
            with open(json_path, "w") as f:
                json.dump(event, f, indent=4)
            logging.info(f"Speed Violation - {event}")
            logged_vehicles[track_id] = frame_index  # Set cooldown
            del pending_saves[track_id]
            pending_ids.discard(track_id)

        # Check for speed violations
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

                center = speed_estimator.track_history[track_id][-1]
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename_base = f"event_{frame_index}_id{track_id}_{timestamp}"
                json_path = os.path.join(output_dir, filename_base + ".json")
                image_path = os.path.join(output_dir, filename_base + ".jpg")

                # Create event data
                event = {
                    "frame_index": frame_index + 1,  # Save next frame
                    "timestamp": datetime.now().isoformat(),
                    "vehicle_id": int(track_id),
                    "speed": round(float(speed), 2),
                    "position": {
                        "x": round(float(center[0]), 2),
                        "y": round(float(center[1]), 2),
                    },
                }

                # Schedule the event for saving
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
cv2.destroyAllWindows()
