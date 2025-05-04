import express from 'express'
import path, { dirname } from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import chokidar from 'chokidar';
import dotenv from 'dotenv';
dotenv.config();

const app = express()
const PORT = 3000;
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const EVENTS_DIR = path.join(__dirname, 'speed_events');
const MAX_FILES = 10;

const MONGO_URI = process.env.MONGODB_URI

const violationSchema = new mongoose.Schema({
  custom_user_id: String,
  speed: Number,
  decibel_level: Number,
  status: String,
  detected_at: Date,
  plate_number: String,
  updated_at: Date,
  created_at: Date
});

const Violation = mongoose.model('Violation', violationSchema);

const eventImageSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Violation',
    required: true
  },
  Image: Buffer
});

const EventImage = mongoose.model('EventImage', eventImageSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  plate_number: String,
  password: String,
  license_id_image: String,
  school_id: String,
  status: String,
  role: String,
  custom_id: String,
  updated_at: Date,
  created_at: Date,
  token: String
});

const User = mongoose.model('User', userSchema, 'users');

if (!fs.existsSync(EVENTS_DIR)) {
  fs.mkdirSync(EVENTS_DIR);
}

// Upload JSON event to MongoDB
async function uploadEventToDatabase(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const event = JSON.parse(raw);

    // Normalize the license plate
    if (event.plate_number) {
      const normalizedPlate = event.plate_number
        .toUpperCase()
        .replace(/\s+/g, '')                   
        .replace(/^([A-Z]+)(\d+)$/, '$1-$2');  

      event.plate_number = normalizedPlate;

      // Lookup user
      const user = await User.findOne({ plate_number: normalizedPlate });
      event.custom_user_id = user ? user.custom_id : 0;
    } else {
      event.custom_user_id = 0;
    }

    const basename = path.basename(filePath, '.json');
    const imagePath = path.join(EVENTS_DIR, `${basename}.jpg`);

    let imageBuffer = null;

    if (fs.existsSync(imagePath)) {
      imageBuffer = fs.readFileSync(imagePath);
    } else {
      console.warn(`[WARN] Image file not found for: ${basename}`);
    }

    const newEvent = new Violation(event);

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
    })
});

app.get('/', (req, res) => {
  res.send('Speed Event Monitor Running');
});