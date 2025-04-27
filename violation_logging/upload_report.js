import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Avatar,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserDetailsModal = ({ open, onClose, user, apiUrl }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Modal Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          User Details
        </DialogTitle>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Modal Content */}
      <DialogContent>
        <Box sx={{ mt: 2, p: 2 }}>
          {/* License ID Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
            }}
          >
            {user.license_id_image && (
              <Avatar
                src={`${apiUrl}/${user.license_id_image}`}
                alt="License ID"
                sx={{
                  width: 150,
                  height: 150,
                  border: "2px solid #ddd",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
          </Box>

          {/* User Details in Two Columns */}
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                User ID:
              </Typography>
              <Typography variant="body2">{user.custom_id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Name:
              </Typography>
              <Typography variant="body2">{user.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Email:
              </Typography>
              <Typography variant="body2">{user.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Plate Number:
              </Typography>
              <Typography variant="body2">{user.plate_number}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Role:
              </Typography>
              <Typography variant="body2">{user.role}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Status:
              </Typography>
              <Typography variant="body2">{user.status}</Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
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

const violationSchema = new mongoose.Schema({
  custom_user_id: Number,
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
    });
});

app.get('/', (req, res) => {
  res.send('Speed Event Monitor Running');
});
