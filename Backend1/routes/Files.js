const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../data/models/File');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ Code: 400, Msg: 'No file uploaded' });
  }

  console.log('Uploaded File:', req.file); 

  const newFile = new File({
    filename: req.file.originalname,
    filePath: req.file.path,
    mimetype: req.file.mimetype
  });

  try {
    const savedFile = await newFile.save();
    res.send({ Code: 200, Msg: 'File uploaded successfully', data: savedFile });
  } catch (err) {
    res.status(500).send({ Code: 500, Msg: 'Server error', error: err });
  }
});

router.get('/download/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).send({ Code: 404, Msg: 'File not found' });
    }

    const filePath = path.resolve(file.filePath);

    console.log('File Path:', filePath);
    console.log('File MIME Type:', file.mimetype);
    console.log('File Name:', file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ Code: 404, Msg: 'File not found on disk' });
    }

    res.setHeader('Content-Type', file.mimetype);
    const filename = path.basename(file.filename);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        return res.status(500).send({ Code: 500, Msg: 'Server error', error: err.message });
      }
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send({ Code: 500, Msg: 'Server error', error: err.message });
  }
});

router.get('/preview/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).send({ Code: 404, Msg: 'File not found' });
    }
    res.setHeader('Content-Type', file.mimetype);
    res.sendFile(path.resolve(file.filePath));
  } catch (err) {
    res.status(500).send({ Code: 500, Msg: 'Server error', error: err });
  }
});

module.exports = router;
