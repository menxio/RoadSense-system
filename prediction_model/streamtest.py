import cv2
import time
import subprocess
import numpy as np
import threading
import logging

RTSP_URL = "rtsp://roadsense:roadsense@192.168.1.6:554/stream1"
AUDIO_SAMPLE_RATE = 16000
BYTES_PER_SAMPLE = 2
CHUNK_DURATION = 0.5  # seconds
CHUNK_SIZE = int(AUDIO_SAMPLE_RATE * CHUNK_DURATION)
CHUNK_BYTES = CHUNK_SIZE * BYTES_PER_SAMPLE

# Configure logging
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)

# Audio thread flag
running = True


def read_audio_volume():
    global running
    ffmpeg_audio_cmd = [
        "ffmpeg",
        "-rtsp_transport",
        "tcp",
        "-i",
        RTSP_URL,
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
        volume = np.linalg.norm(audio_np) / len(audio_np)
        logging.info(f"[AUDIO] Volume: {volume:.6f}")

    proc.terminate()
    proc.wait()
    logging.info("Audio stream closed.")


def main() -> None:
    global running

    # Start audio reader thread
    audio_thread = threading.Thread(target=read_audio_volume, daemon=True)
    audio_thread.start()

    cap = cv2.VideoCapture(RTSP_URL, cv2.CAP_FFMPEG)
    if not cap.isOpened():
        raise RuntimeError(f"Failed to open stream: {RTSP_URL}")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 20.0
    logging.info(f"Video stream opened — {width}×{height} @ {fps:.2f} FPS")

    frame_count, t0 = 0, time.time()

    while True:
        ok, frame = cap.read()
        if not ok:
            logging.warning("Failed to read video frame — exiting.")
            break

        frame_count += 1
        if frame_count % 30 == 0:
            t1 = time.time()
            elapsed = t1 - t0
            live_fps = frame_count / elapsed if elapsed else 0.0
            cv2.setWindowTitle("RTSP Preview", f"RTSP Preview – {live_fps:.1f} FPS")
            frame_count, t0 = 0, t1

        cv2.imshow("RTSP Preview", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    # Cleanup
    running = False
    cap.release()
    cv2.destroyAllWindows()
    logging.info("Video stream closed.")
    audio_thread.join()


if __name__ == "__main__":
    main()
