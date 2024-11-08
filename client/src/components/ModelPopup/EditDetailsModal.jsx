import React, { useState } from 'react';
import { useFormik } from 'formik';
import "./ModelPopup.css";
import axios from 'axios';
import { axiosPut } from "../../axiosServices";

const EditDetailsModal = ({ empById, setEditModal }) => {
    const { name, email, mobile, designation, gender, course, image } = empById;
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);  // For holding new image

    const handleEdit = async (values) => {
        setLoading(true);
        const formData = new FormData();
        
        // Add form values to FormData
        Object.keys(values).forEach((key) => formData.append(key, values[key]));

        // If new image is uploaded, append it to formData
        if (imageFile) formData.append('image', imageFile);
        else if (image) formData.append('image', image); // Keep the old image if no new image

        try {
            const res = await axiosPut(`/employee/${empById._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setLoading(false);
            setEditModal(false);
            console.log(res);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image
        },
        onSubmit: values => {
            handleEdit(values);
        }
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Prepare FormData for Cloudinary upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'e2vgn6fr'); // Unsigned preset

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dn0dey1h5/image/upload', formData);
            setImageFile(response.data.secure_url); // Save the secure URL of the uploaded image
        } catch (err) {
            console.error('Error uploading image:', err);
        }
    };

    return (
        <div className="modalContainer fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <form onSubmit={formik.handleSubmit} className="bg-white w-full sm:w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-lg shadow-lg">
                <div className="modalBox">
                    <div className="modalHeader mb-4">
                        <h2 className="text-xl font-semibold">Edit Employee Details</h2>
                    </div>
                    <div className="modalInner space-y-4">
                        <div className="input-box">
                            <label className="block text-sm font-medium">Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                onChange={formik.handleChange} 
                                value={formik.values.name} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="input-box">
                            <label className="block text-sm font-medium">Image</label>
                            <input 
                                type="file" 
                                name="image" 
                                onChange={handleImageChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {image && !imageFile && (
                                <div className="mt-2 text-sm text-gray-500">Current image: <img src={image} alt="Employee" className="w-20 h-20 rounded-full" /></div>
                            )}
                        </div>
                        <div className="input-container grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="input-box">
                                <label className="block text-sm font-medium">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    onChange={formik.handleChange} 
                                    value={formik.values.email} 
                                    required 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="input-box">
                                <label className="block text-sm font-medium">Mobile</label>
                                <input 
                                    type="text" 
                                    name="mobile" 
                                    onChange={formik.handleChange} 
                                    value={formik.values.mobile} 
                                    required 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        {/* Designation Dropdown */}
                        <div className="input-box">
                            <label className="block text-sm font-medium">Designation</label>
                            <select 
                                name="designation" 
                                onChange={formik.handleChange} 
                                value={formik.values.designation} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select</option>
                                <option value="HR">HR</option>
                                <option value="Manager">Manager</option>
                                <option value="Sales">Sales</option>
                            </select>
                        </div>
                        
                        {/* Gender Radio Buttons */}
                        <div className="input-box">
                            <label className="block text-sm font-medium">Gender</label>
                            <div className="mt-2 space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="M"
                                        onChange={formik.handleChange}
                                        checked={formik.values.gender === 'M'}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2">Male</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="F"
                                        onChange={formik.handleChange}
                                        checked={formik.values.gender === 'F'}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2">Female</span>
                                </label>
                            </div>
                        </div>

                        {/* Course Checkbox */}
                        <div className="input-box">
                            <label className="block text-sm font-medium">Course</label>
                            <div className="mt-2 space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="course"
                                        value="MCA"
                                        onChange={formik.handleChange}
                                        checked={formik.values.course.includes('MCA')}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2">MCA</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="course"
                                        value="BCA"
                                        onChange={formik.handleChange}
                                        checked={formik.values.course.includes('BCA')}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2">BCA</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="course"
                                        value="BSC"
                                        onChange={formik.handleChange}
                                        checked={formik.values.course.includes('BSC')}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2">BSC</span>
                                </label>
                            </div>
                        </div>

                        <div className="modalFooter mt-4">
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                                {loading ? 'Updating...' : 'Update Employee'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditDetailsModal;
