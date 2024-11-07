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

    // Prepare FormData for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'e2vgn6fr'); // Your unsigned upload preset from Cloudinary

    try {
      // Show loading spinner while uploading image
      setLoading(true);

      // Upload image to Cloudinary
      const response = await axios.post('https://api.cloudinary.com/v1_1/dn0dey1h5/image/upload', formData);

      console.log("Cloudinary upload response:", response.data); // Log the Cloudinary response
      setImageFile(response.data.secure_url); // Save the secure URL of the uploaded image
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setLoading(false);  // Hide loading spinner after upload completes
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
      const employeeData = { ...values, image: imageFile }; // Include image URL in employee data
  
      const res = await axiosPost('/employee', employeeData);
      console.log(res);
      setLoading(false);
      setShowModal(false);  // Close modal after successful employee creation
    } catch (err) {
      console.log("Error creating employee:", err);
      setLoading(false);
    }
  };
  

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      job: '',
      dateofjoining: '',
      image: '', // Image will be handled separately
    },
    onSubmit: (values) => {
      createEmployee(values); // Submit form with employee data
    },
  });

  return (
    <div className="modalContainer">
      <form onSubmit={formik.handleSubmit}>
        <div className="modalBox">
          <div className="modalHeader">
            <h2>New Employee Details</h2>
          </div>
          <div className="modalInner">
            {/* Form Fields */}
            <div className="input-box">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                name="firstname"
                required  
                onChange={formik.handleChange}
                value={formik.values.firstname}
              />
            </div>
            <div className="input-box">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                name="lastname"
                required
                onChange={formik.handleChange}
                value={formik.values.lastname}
              />
            </div>
            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>
            <div className="input-box">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                required
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
            </div>
            <div className="input-box">
              <label htmlFor="job">Job</label>
              <input
                type="text"
                name="job"
                required
                onChange={formik.handleChange}
                value={formik.values.job}
              />
            </div>
            <div className="input-box">
              <label htmlFor="dateofjoining">Date of Joining</label>
              <input
                type="date"
                name="dateofjoining"
                required
                onChange={formik.handleChange}
                value={formik.values.dateofjoining}
              />
            </div>

            {/* Image Upload */}
            <div className="input-box">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleImageUpload} // Handle image file selection
              />
            </div>

            {/* Submit Button */}
            <div className="modalFooter">
              <button className="add-btn" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModelPopup;
