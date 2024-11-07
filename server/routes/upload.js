const express = require('express');
const cloudinary = require('cloudinary').v2; // Use the v2 version for Cloudinary
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config(); // Load environment variables

const router = express.Router();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Temporary image upload and Cloudinary upload
router.post('/upload-image', (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const tempFilePath = path.join(__dirname, '../public/temp', req.file.filename);

  // Upload the file to Cloudinary
  cloudinary.uploader.upload(tempFilePath, async (error, result) => {
    if (error) {
      fs.unlinkSync(tempFilePath); // Ensure temp file is deleted on error
      return res.status(500).json({ message: "Cloudinary upload failed", error });
    }

    // Delete the temp file after upload
    fs.unlinkSync(tempFilePath);

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url
    });
  });
});

module.exports = router;
