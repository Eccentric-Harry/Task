const express = require('express');
const router = express.Router();
const Employees = require('../schemas/Employees');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryConfig');
const fs = require('fs');
const path = require('path');
const { upload } = require('../middlewares/multer');  


router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log(req.body); 
        const { name, email, mobile, designation, gender, course } = req.body;


       
        if (!name || !email || !mobile || !designation || !gender || !course) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let imageUrl = req.body.image;  

      
        if (req.file) {
            const tempFilePath = path.join(__dirname, '../public/temp', req.file.filename);
            const result = await uploadOnCloudinary(tempFilePath, { folder: "employee-images" });
            imageUrl = result.secure_url;

        
            fs.unlinkSync(tempFilePath);
        }

       
        const newEmployee = new Employees({
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image: imageUrl,  
        });

        await newEmployee.save();
        res.status(201).json({ employee: newEmployee, message: "Employee created successfully" });
    } catch (err) {
        console.error('Error creating employee:', err); 
        res.status(500).json({ message: 'Error creating employee', error: err.message });
    }
});


router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { image } = req.body;
        let imageUrl = image;

     
        if (req.file) {
            const tempFilePath = path.join(__dirname, '../public/temp', req.file.filename);
            const result = await uploadOnCloudinary(tempFilePath, { folder: "employee-images" });
            imageUrl = result.secure_url;

          
            fs.unlinkSync(tempFilePath);
        }

    
        const employee = await Employees.findById(employeeId);
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }

        
        if (employee.image && imageUrl !== employee.image) {
            const publicId = employee.image.split('/').pop().split('.')[0]; 
            await deleteFromCloudinary(publicId);  
        }

        
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


router.get('/', async (req, res) => {
    try {
        const employees = await Employees.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving employees', error: err.message });
    }
});


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


router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employees.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }
  
        if (employee.image) {
            const publicId = employee.image.split('/').pop().split('.')[0]; 
            await deleteFromCloudinary(publicId); 
        }
        res.status(200).send({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error deleting employee', error: err.message });
    }
});


router.get('/search/:query', async (req, res) => {
    try {
        const searchTerm = req.params.query;

      
        const employees = await Employees.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { dateOfJoining: { $regex: searchTerm, $options: 'i' } }
            ]
        });

       
        if (employees.length === 0) {
            return res.status(200).json([]);  
        }

        res.status(200).json(employees);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


module.exports = router;
