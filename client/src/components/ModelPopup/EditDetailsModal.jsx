import React, { useState } from 'react';
import { useFormik } from 'formik';
import "./ModelPopup.css";
import axios from 'axios';
import { axiosPut } from "../../axiosServices";

const EditDetailsModal = ({ empById, setEditModal }) => {
    const { name, email, mobile, designation, gender, course, image } = empById;
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const handleEdit = async (values) => {
        setLoading(true);
        const formData = new FormData();

        Object.keys(values).forEach((key) => formData.append(key, values[key]));
        if (imageFile) formData.append('image', imageFile);
        else if (image) formData.append('image', image);

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
        initialValues: { name, email, mobile, designation, gender, course, image },
        onSubmit: values => handleEdit(values),
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'e2vgn6fr');

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dn0dey1h5/image/upload', formData);
            setImageFile(response.data.secure_url);
        } catch (err) {
            console.error('Error uploading image:', err);
        }
    };

    return (
        <div className="modalContainer fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white w-full sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-lg relative"
            >
                {/* Close Button */}
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-semibold"
                    onClick={() => setEditModal(false)}
                >
                    &times;
                </button>

                <div className="modalHeader mb-4">
                    <h2 className="text-xl font-semibold">Edit Employee Details</h2>
                </div>

                <div className="modalInner space-y-4">
                    {/* Name Field */}
                    <div className="input-box">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            required
                            className="block w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="input-box">
                        <label>Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="block w-full"
                        />
                        {image && !imageFile && (
                            <div className="mt-2">
                                Current image: <img src={image} alt="Employee" className="w-20 h-20 rounded-full" />
                            </div>
                        )}
                    </div>

                    {/* Email and Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="input-box">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                required
                                className="block w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="input-box">
                            <label>Mobile</label>
                            <input
                                type="text"
                                name="mobile"
                                onChange={formik.handleChange}
                                value={formik.values.mobile}
                                required
                                className="block w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                    </div>

                    {/* Designation Dropdown */}
                    <div className="input-box">
                        <label>Designation</label>
                        <select
                            name="designation"
                            onChange={formik.handleChange}
                            value={formik.values.designation}
                            required
                            className="block w-full px-3 py-2 border rounded-md"
                        >
                            <option value="">Select</option>
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>

                    {/* Gender Radio Buttons */}
                    <div className="input-box">
                        <label>Gender</label>
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="M"
                                    onChange={formik.handleChange}
                                    checked={formik.values.gender === 'M'}
                                    className="h-4 w-4"
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
                                    className="h-4 w-4"
                                />
                                <span className="ml-2">Female</span>
                            </label>
                        </div>
                    </div>

                    {/* Course Checkbox */}
                    <div className="input-box">
                        <label>Course</label>
                        <div className="flex space-x-4">
                            {["MCA", "BCA", "BSC"].map((courseOption) => (
                                <label key={courseOption} className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="course"
                                        value={courseOption}
                                        onChange={formik.handleChange}
                                        checked={formik.values.course.includes(courseOption)}
                                        className="h-4 w-4"
                                    />
                                    <span className="ml-2">{courseOption}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="modalFooter mt-4">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                        >
                            {loading ? 'Updating...' : 'Update Employee'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditDetailsModal;
