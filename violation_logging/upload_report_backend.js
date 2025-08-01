import express from "express"
import path, { dirname } from "path"
import fs from "fs"
import mongoose from "mongoose"
import chokidar from "chokidar"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
dotenv.config()

const app = express()
const PORT = 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))
console.log({ __dirname })
const EVENTS_DIR = path.join(
  __dirname,
  "../backend/storage/app/public/violation_images"
)
console.log({ EVENTS_DIR })

const MAX_FILES = 10

const MONGO_URI = process.env.MONGODB_URI

const violationSchema = new mongoose.Schema({
  custom_user_id: String,
  speed: Number,
  decibel_level: Number,
  status: String,
  detected_at: Date,
  plate_number: String,
  updated_at: Date,
  created_at: Date,
  violation_image_path: String,
})

const Violation = mongoose.model("Violation", violationSchema)

const eventImageSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Violation",
    required: true,
  },
  Image: Buffer,
})

const EventImage = mongoose.model("EventImage", eventImageSchema)

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
  token: String,
})

const User = mongoose.model("User", userSchema, "users")

if (!fs.existsSync(EVENTS_DIR)) {
  fs.mkdirSync(EVENTS_DIR)
}

// Upload JSON event to MongoDB
async function uploadEventToDatabase(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8")
    const event = JSON.parse(raw)

    // Normalize the license plate
    if (event.plate_number) {
      const normalizedPlate = event.plate_number
        .toUpperCase()
        .replace(/\s+/g, "")
        .replace(/^([A-Z]+)(\d+)$/, "$1 $2")

      event.plate_number = normalizedPlate

      console.log("Normalized:", normalizedPlate)

      // Use regex with space, but escape special characters
      const regexPlate = new RegExp(
        `^${normalizedPlate.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}$`,
        "i"
      )

      console.log("Regex:", regexPlate)

      const user = await User.findOne({
        plate_number: { $regex: regexPlate },
      })
      console.log("User:", user)

      event.custom_user_id = user?.custom_id
    } else {
      event.custom_user_id = 0
    }
    const basename = path.basename(filePath, ".json")
    console.log({ basename })

    event.violation_image_path = `/violation_images/${basename}.jpg`
    console.log(event.violation_image_path)

    const newEvent = new Violation(event)

    await newEvent.save()

    console.log(`[DB] Uploaded event: ${basename}`)
  } catch (err) {
    console.error(`[ERROR] Failed to upload event: ${err.message}`)
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`)

  try {
    await mongoose.connect(MONGO_URI)
    console.log("[DB] Connected to MongoDB")
  } catch (err) {
    console.error("[DB] Connection error:", err.message)
    return
  }

  // Start watching directory
  chokidar
    .watch(EVENTS_DIR, { persistent: true, depth: 0 })
    .on("add", async (filePath) => {
      if (filePath.endsWith(".json")) {
        console.log(`[WATCHER] New file detected: ${filePath}`)
        await uploadEventToDatabase(filePath)
        // trimOldFiles()
      }
    })
})
