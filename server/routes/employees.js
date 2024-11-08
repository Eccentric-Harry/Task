const express = require('express');
const router = express.Router();
const Employees = require('../schemas/Employees');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryConfig'); // Adjusted Cloudinary import
const fs = require('fs');
const path = require('path');
const { upload } = require('../middlewares/multer');
const { createEmployee, updateEmployeeAvatar } = require('../controllers/userController');

// Route to create a new employee with optional image upload using the controller
// router.post('/', upload.single('image'), createEmployee);
router.post('/', async (req, res) => {
    const { firstname, lastname, email, phone, job, dateofjoining, image } = req.body;
    
    if (!firstname || !lastname || !email || !phone || !job || !dateofjoining) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    const newEmployee = new Employees({
      firstname,
      lastname,
      email,
      phone,
      job,
      dateofjoining,
      image,  // Directly from the frontend
    });
  
    try {   
      await newEmployee.save();
      res.status(201).json({ employee: newEmployee, message: "Employee created successfully" });
    } catch (err) {
      res.status(500).json({ message: 'Error creating employee', error: err.message });
    }
  });
  

// Route to update employee avatar with new image upload using the controller
router.put('/:id', upload.single('image'), updateEmployeeAvatar);

// Route to get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employees.find();
        res.json(employees);
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
        res.json(employee);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving employee', error: err.message });
    }
});

// Route to update employee by ID with optional image upload
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let imageUrl = req.body.image;

        // Check if a new file was uploaded
        if (req.file) {
            const tempFilePath = path.join(__dirname, '../public/temp', req.file.filename);

            // Upload the image to Cloudinary
            const result = await uploadOnCloudinary(tempFilePath, { folder: "employee-images" });
            imageUrl = result.secure_url;

            // Remove the temporary file after upload
            fs.unlinkSync(tempFilePath);
        }

        // Update the employee data in the database
        const employee = await Employees.findByIdAndUpdate(
            req.params.id,
            { ...req.body, image: imageUrl },
            { new: true }
        );

        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }

        res.send(employee);
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).send({ message: 'Error updating employee', error: err.message });
    }
});

// Route to delete employee by ID
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employees.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }
        res.send({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error deleting employee', error: err.message });
    }
});

// Route to search employee by first name
router.get('/search/:search', async (req, res) => {
    try {
        const employees = await Employees.find({ firstname: req.params.search });
        if (!employees.length) {
            return res.status(404).send({ message: 'Employee not found' });
        }
        res.json(employees);
    } catch (err) {
        res.status(500).send({ message: 'Error searching employee', error: err.message });
    }
});

module.exports = router;
