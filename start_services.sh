#!/bin/bash

# Activate Python environment and run Python script
source ~/yolov11-env/bin/activate
nohup python3 run_predictions.py > run_predictions.log 2>&1 &
echo $! > run_predictions.pid

# Run Node.js script
nohup node violation_logging/upload_report.js > upload_report.log 2>&1 &
echo $! > upload_report.pid

# Start mediamtx
nohup mediamtx > mediamtx.log 2>&1 &
echo $! > mediamtx.pid

echo "All services started and detached from terminal."
