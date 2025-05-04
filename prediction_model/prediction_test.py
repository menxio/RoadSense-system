import cv2
import json
import os
from datetime import datetime
from collections import deque
from ultralytics.solutions import speed_estimation

cap = cv2.VideoCapture("training_1.mp4")
assert cap.isOpened(), "Error reading video file"

w, h, fps = (int(cap.get(x)) for x in (
    cv2.CAP_PROP_FRAME_WIDTH,
    cv2.CAP_PROP_FRAME_HEIGHT,
    cv2.CAP_PROP_FPS
))
video_writer = cv2.VideoWriter("predictions.avi", cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))

# Define speed estimation region
speed_region = [
    (300, 500),
    (1650, 500),
    (1650, 250),
    (300, 250)
]

# Initialize speed estimator
speed_estimator = speed_estimation.SpeedEstimator(
    show=True,
    conf=0.4,
    model="yolo11n_ncnn_model",
    region=speed_region,
    line_width=2,
)

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("frame capture failed or processing done.")
        break
    results = speed_estimator(frame)
    video_writer.write(results.plot_im)

cap.release()
video_writer.release()
cv2.destroyAllWindows()
