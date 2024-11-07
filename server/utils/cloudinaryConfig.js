// utils/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image to Cloudinary
const uploadOnCloudinary = async (filePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, options);
        return result;  // Returns the full result with URL and public_id
    } catch (error) {
        throw new Error('Error uploading image to Cloudinary');
    }
};

// Function to delete an image from Cloudinary by public_id
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error('Error deleting image from Cloudinary');
    }
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };
