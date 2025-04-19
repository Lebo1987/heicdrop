// server.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.static('output'));

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Ensure upload/output directories exist
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
if (!fs.existsSync('./output')) fs.mkdirSync('./output');

// POST route for converting HEIC to JPG
app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputFilename =
      path.basename(req.file.originalname, path.extname(req.file.originalname)) + '.jpg';
    const outputPath = path.join('output', outputFilename);

    await sharp(inputPath)
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    // Clean up upload
    fs.unlinkSync(inputPath);

    res.download(outputPath, outputFilename, (err) => {
      if (err) console.error(err);
      fs.unlinkSync(outputPath); // Clean output after download
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Conversion failed');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
