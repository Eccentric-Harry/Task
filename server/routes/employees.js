const express = require('express');
const router = express.Router();
const Employees = require('../schemas/Employees');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryConfig');
const fs = require('fs');
const path = require('path');
const { upload } = require('../middlewares/multer');  // Assuming multer is set up properly

// Route to create a new employee with image upload (optional) or image URL
router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log(req.body); 
        const { name, email, mobile, designation, gender, course } = req.body;


        // Validation: All fields are required
        if (!name || !email || !mobile || !designation || !gender || !course) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let imageUrl = req.body.image;  // Start with the image URL if provided

        // If the image is uploaded as a file, upload it to Cloudinary
        if (req.file) {
            const tempFilePath = path.join(__dirname, '../public/temp', req.file.filename);
            const result = await uploadOnCloudinary(tempFilePath, { folder: "employee-images" });
            imageUrl = result.secure_url;

            // Remove the temporary file after uploading
            fs.unlinkSync(tempFilePath);
        }

        // Create new employee with image URL
        const newEmployee = new Employees({
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image: imageUrl,  // Store image URL in the database
        });

        await newEmployee.save();
        res.status(201).json({ employee: newEmployee, message: "Employee created successfully" });
    } catch (err) {
        console.error('Error creating employee:', err); 
        res.status(500).json({ message: 'Error creating employee', error: err.message });
    }
});

// Route to update employee avatar (image) by ID
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { image } = req.body;
        let imageUrl = image;

        // If new image file is uploaded, upload it to Cloudinary
        if (req.file) {
            const tempFilePath = path.join(__dirname, '../public/temp', req.file.filename);
            const result = await uploadOnCloudinary(tempFilePath, { folder: "employee-images" });
            imageUrl = result.secure_url;

            // Remove the temporary file after uploading
            fs.unlinkSync(tempFilePath);
        }

        // Find the employee by ID
        const employee = await Employees.findById(employeeId);
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }

        // If the employee already has an image, delete it from Cloudinary
        if (employee.image && imageUrl !== employee.image) {
            const publicId = employee.image.split('/').pop().split('.')[0]; // Extract public_id from URL
            await deleteFromCloudinary(publicId);  // Delete the old image from Cloudinary
        }

        // Update employee data with the new image URL
        employee.image = imageUrl;
        employee.name = req.body.name || employee.name;
        employee.email = req.body.email || employee.email;
        employee.mobile = req.body.mobile || employee.mobile;
        employee.designation = req.body.designation || employee.designation;
        employee.gender = req.body.gender || employee.gender;
        employee.course = req.body.course || employee.course;

        await employee.save();
        res.status(200).json({ employee, message: "Employee updated successfully" });
    } catch (err) {
        res.status(500).send({ message: 'Error updating employee', error: err.message });
    }
});

// Route to get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employees.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving employees', error: err.message });
    }
});

// Route to get employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employees.findById(req.params.id);
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving employee', error: err.message });
    }
});

// Route to delete employee by ID
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employees.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }
        // Delete image from Cloudinary if it exists
        if (employee.image) {
            const publicId = employee.image.split('/').pop().split('.')[0]; // Extract public_id from URL
            await deleteFromCloudinary(publicId);  // Delete the old image from Cloudinary
        }
        res.status(200).send({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error deleting employee', error: err.message });
    }
});

// Route to search employee by first name
router.get('/search/:search', async (req, res) => {
    try {
        const searchTerm = req.params.search;
        // Adjust your search query to match the employee schema
        const employees = await Employees.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { mobile: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        if (employees.length === 0) {
            return res.status(404).json({ message: 'No employees found' });
        }
        
        res.status(200).json(employees);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
