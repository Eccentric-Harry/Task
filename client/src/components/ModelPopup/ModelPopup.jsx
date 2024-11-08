import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { axiosPost } from '../../axiosServices'; // Assuming axiosPost is a custom helper

const ModelPopup = ({ setShowModal }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'e2vgn6fr'); // Your unsigned upload preset from Cloudinary

    try {
      setLoading(true);
      const response = await axios.post('https://api.cloudinary.com/v1_1/dn0dey1h5/image/upload', formData);
      console.log("Cloudinary upload response:", response.data);
      setImageFile(response.data.secure_url);
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new employee
  const createEmployee = async (values) => {
    if (!imageFile) {
      alert('Please upload an image');
      return;
    }
  
    setLoading(true);
    try {
      // Convert the 'course' array to a comma-separated string before sending it to the backend
      const employeeData = { 
        ...values, 
        image: imageFile,
        course: values.course.join(', ') // Joining array values into a string
      };
      const res = await axiosPost('/employee', employeeData);
      console.log(res);
      setLoading(false);
      setShowModal(false);
    } catch (err) {
      console.log("Error creating employee:", err);
      setLoading(false);
    }
  };
  

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      designation: '',
      gender: '',
      course: '',
      dateofjoining: '',
      image: '',
    },
    onSubmit: (values) => {
      createEmployee(values);
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-auto">
        <div className="modalHeader flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Employee Details</h2>
          <button type="button" className="text-xl text-gray-600 hover:text-gray-800" onClick={() => setShowModal(false)}>×</button>
        </div>
        <div className="modalInner space-y-4 max-h-screen overflow-auto">
          {/* Form Fields */}
          <div className="input-box flex items-center justify-between mb-2">
            <label htmlFor="name" className="block text-sm font-medium w-1/4">Name</label>
            <input
              type="text"
              name="name"
              required
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="input-box flex items-center justify-between mb-2">
            <label htmlFor="email" className="block text-sm font-medium w-1/4">Email</label>
            <input
              type="email"
              name="email"
              required
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="input-box flex items-center justify-between mb-2">
            <label htmlFor="mobile" className="block text-sm font-medium w-1/4">Mobile</label>
            <input
              type="text"
              name="mobile"
              required
              onChange={formik.handleChange}
              value={formik.values.mobile}
              className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="input-box flex items-center justify-between mb-2">
            <label htmlFor="designation" className="block text-sm font-medium w-1/4">Designation</label>
            <select
              name="designation"
              required
              onChange={formik.handleChange}
              value={formik.values.designation}
              className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div className="input-box flex items-center justify-between mb-2">
            <label className="block text-sm font-medium w-1/4">Gender</label>
            <div className="w-3/4 flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  onChange={formik.handleChange}
                  checked={formik.values.gender === 'M'}
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  onChange={formik.handleChange}
                  checked={formik.values.gender === 'F'}
                  className="mr-2"
                />
                Female
              </label>
            </div>
          </div>

          <div className="input-box flex items-center justify-between mb-2">
            <label className="block text-sm font-medium w-1/4">Course</label>
            <div className="w-3/4 flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="MCA"
                  onChange={formik.handleChange}
                  checked={formik.values.course.includes('MCA')}
                  className="mr-2"
                />
                MCA
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="BCA"
                  onChange={formik.handleChange}
                  checked={formik.values.course.includes('BCA')}
                  className="mr-2"
                />
                BCA
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="BSC"
                  onChange={formik.handleChange}
                  checked={formik.values.course.includes('BSC')}
                  className="mr-2"
                />
                BSC
              </label>
            </div>
          </div>

          <div className="input-box flex items-center justify-between mb-2">
            <label htmlFor="dateofjoining" className="block text-sm font-medium w-1/4">Date of Joining</label>
            <input
              type="date"
              name="dateofjoining"
              required
              onChange={formik.handleChange}
              value={formik.values.dateofjoining}
              className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Upload */}
          <div className="input-box flex items-center justify-between mb-2">
            <label htmlFor="image" className="block text-sm font-medium w-1/4">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageUpload}
              className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="modalFooter flex justify-end mt-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Details'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModelPopup;
