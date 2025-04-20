# PROJECT ROADSENSE
*items enclosed in  are commands.*

*to copy and paste, do: `cat` <file_name> and CTRL+SHIFT+C on the terminal text output.*

*the scripts are silent, logs are written in .log files.*

## setup
`source` ~.bashrc

`source` ~.yolov11-env/bin/activate

`cd` roadsense/

### YOLO Model
`python3` run_predictions.py
- starts the YOLO prediction model. responsible for speed estimation and report generation.

### violation logger
`node` upload_report.js
- this starts report and image uploads located in roadsense/violation_logging/speed_events/ to the mongodb database.

### webRTC
`mediamtx`
- this will start the webRTC client. configure via mediamtx.yml file.

## `./start_services.sh` does all of this in the background.
## `./stop_services.sh` kills the started services.
