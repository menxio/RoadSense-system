const express = require('express');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const mongoose = require('mongoose');
const {MongoClient, ServerApiVersion} = require('mongodb')
require('dotenv').config()
const logStream = fs.createWriteStream(path.join(__dirname, '../upload_report.log'), { flags: 'a' });

// Redirect console.log and console.error
console.log = function (message, ...optionalParams) {
  logStream.write(`[INFO] ${new Date().toISOString()} - ${message}\n`);
  optionalParams.forEach(param => logStream.write(`${JSON.stringify(param)}\n`));
};

console.error = function (message, ...optionalParams) {
  logStream.write(`[ERROR] ${new Date().toISOString()} - ${message}\n`);
  optionalParams.forEach(param => logStream.write(`${JSON.stringify(param)}\n`));
};

const app = express();
const PORT = 3000;
const EVENTS_DIR = path.join(__dirname, 'speed_events');
const MAX_FILES = 10;

const MONGO_URI = process.env.MONGODB_URI

const speedEventSchema = new mongoose.Schema({
  vehicle_id: Number,
  speed: Number,
  timestamp: Date,
  plate: Number,
  frame_index: Number,
  position: {
    x: Number,
    y: Number
  }
});

const SpeedEvent = mongoose.model('SpeedEvent', speedEventSchema);

const eventImageSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpeedEvent',
    required: true
  },
  Image: Buffer
});

const EventImage = mongoose.model('EventImage', eventImageSchema);


if (!fs.existsSync(EVENTS_DIR)) {
  fs.mkdirSync(EVENTS_DIR);
}

// Upload JSON event to MongoDB
async function uploadEventToDatabase(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const event = JSON.parse(raw);
    
    const basename = path.basename(filePath, '.json');
    const imagePath = path.join(EVENTS_DIR, `${basename}.jpg`);
    
    let imageBuffer = null;

    if (fs.existsSync(imagePath)) {
      imageBuffer = fs.readFileSync(imagePath);
    } else {
      console.warn(`[WARN] Image file not found for: ${basename}`);
    }

    const newEvent = new SpeedEvent(event);

    const newEventImg = new EventImage({
      event_id: newEvent._id,
      Image: imageBuffer,
    });

    await newEvent.save();

    if (imageBuffer) {
      await newEventImg.save();
    }

    console.log(`[DB] Uploaded event: ${basename}`);
  } catch (err) {
    console.error(`[ERROR] Failed to upload event: ${err.message}`);
  }
}


// Keep only the 10 most recent files
function trimOldFiles() {
  const files = fs.readdirSync(EVENTS_DIR)
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(EVENTS_DIR, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length > MAX_FILES) {
    const filesToDelete = files.slice(MAX_FILES);
    for (const file of filesToDelete) {
      fs.unlinkSync(path.join(EVENTS_DIR, file.name));
      console.log(`[CLEANUP] Deleted old file: ${file.name}`);
    }
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    await mongoose.connect(MONGO_URI);
    console.log('[DB] Connected to MongoDB');
  } catch (err) {
    console.error('[DB] Connection error:', err.message);
    return;
  }

  // Start watching directory
  chokidar.watch(EVENTS_DIR, { persistent: true, depth: 0 })
    .on('add', async filePath => {
      if (filePath.endsWith('.json')) {
        console.log(`[WATCHER] New file detected: ${filePath}`);
        await uploadEventToDatabase(filePath);
        trimOldFiles();
      }
    });
});

app.get('/', (req, res) => {
  res.send('Speed Event Monitor Running');
});
