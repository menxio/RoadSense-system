import cv2
import easyocr
from ultralytics import YOLO
from ultralytics.solutions import speed_estimation

# Load YOLO detection model separately
detection_model = YOLO("yolo11n_ncnn_model")

# Initialize SpeedEstimator
vehicle_detector = speed_estimation.SpeedEstimator(
    show=False,
    conf=0.4,
    model="yolo11n_ncnn_model",
    region=[(900, 1100), (900, 500)],
    line_width=2,
    classes=[2, 3, 5, 7]
)

# Initialize video and OCR
cap = cv2.VideoCapture("training_5.mp4")
assert cap.isOpened(), "Error: Unable to open video file."
ocr_reader = easyocr.Reader(['en'], gpu=False)

frame_index = 0

while True:
    success, frame = cap.read()
    if not success:
        break

    # Detect vehicles
    detect_results = detection_model.predict(source=frame, conf=0.4, classes=[2, 3, 5, 7], verbose=False)[0]

    for box in detect_results.boxes.xyxy:
        x1, y1, x2, y2 = map(int, box.tolist())
        vehicle_crop = frame[y1:y2, x1:x2]

        if vehicle_crop.size == 0:
            continue

        try:
            gray_vehicle = cv2.cvtColor(vehicle_crop, cv2.COLOR_BGR2GRAY)
            ocr_results = ocr_reader.readtext(gray_vehicle)

            for result in ocr_results:
                text = result[1].strip()
                print(f"frame_index: {frame_index}, detected text: {text}")

                if 5 <= len(text) <= 12 and any(char.isdigit() for char in text):
                    print(f"Valid plate candidate: {text}")
                    break

        except Exception as e:
            print(f"OCR failed on frame {frame_index}: {e}")

    # Estimate vehicle speed separately
    speed_results = vehicle_detector.process(frame)

    frame_index += 1

cap.release()
print("Processing complete.")
