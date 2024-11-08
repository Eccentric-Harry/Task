const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryConfig");
const Employees = require("../schemas/Employees");
const fs = require('fs');
const path = require('path');

const createEmployee = async (req, res, next) => {
    const { name, email, mobile, designation, gender, course, dateofjoining } = req.body;
    const avatarLocalPath = req.file?.path;

    // Check if required fields are provided
    if (!name || !email || !mobile || !designation || !gender || !course || !dateofjoining) {
        return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = null;
    if (avatarLocalPath) {
        try {
            // Upload avatar to Cloudinary
            const avatar = await uploadOnCloudinary(avatarLocalPath, { folder: "employee-images" });
            imageUrl = avatar.secure_url;  // Get the Cloudinary URL
            fs.unlinkSync(avatarLocalPath);  // Delete local file after upload
        } catch (error) {
            return res.status(500).json({ message: "Image upload failed", error: error.message });
        }
    }

    try {
        // Create new employee with image URL (if available)
        const newEmployee = new Employees({
            name,           // name is now a combined field (firstname, lastname)
            email,
            mobile,
            designation,
            gender,
            course,         // Array field for courses
            dateofjoining,
            image: imageUrl, // Store the image URL in the database
        });

        await newEmployee.save();  // Save the employee to the database
        return res.status(201).json({ employee: newEmployee, message: "Employee created successfully" });
    } catch (error) {
        console.error('Error creating employee:', err);
        return res.status(500).json({ message: "Error creating employee", error: error.message });
    }
};

const updateEmployeeAvatar = async (req, res, next) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) return res.status(400).json({ message: "Avatar file is missing" });

    try {
        // Upload new avatar to Cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath, { folder: "employee-images" });
        const employee = await Employees.findById(req.params.id);

        // If the employee already has an image, delete it from Cloudinary
        if (employee.image) {
            const publicId = employee.image.split('/').pop().split('.')[0]; // Extract public_id from URL
            await deleteFromCloudinary(publicId);  // Delete the old image from Cloudinary
        }

        fs.unlinkSync(avatarLocalPath);  // Delete the local file after successful upload

        employee.image = avatar.secure_url;  // Update the employee's image URL
        await employee.save();  // Save the updated employee record

        return res.status(200).json({ employee, message: "Avatar updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Avatar update failed", error: error.message });
    }
};

module.exports = {
    createEmployee,
    updateEmployeeAvatar,
};
