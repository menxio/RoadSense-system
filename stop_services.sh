#!/bin/bash

if [ -f run_predictions.pid ]; then
    kill $(cat run_predictions.pid) && echo "Stopped run_predictions.py"
    rm run_predictions.pid
fi

if [ -f upload_report.pid ]; then
    kill $(cat upload_report.pid) && echo "Stopped upload_report.js"
    rm upload_report.pid
fi

if [ -f mediamtx.pid ]; then
    kill $(cat mediamtx.pid) && echo "Stopped mediamtx"
    rm mediamtx.pid
fi

echo "All services stopped."
