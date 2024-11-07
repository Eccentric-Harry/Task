import React, { useState } from 'react';
import { useFormik } from 'formik';
import "./ModelPopup.css";
import axios from 'axios';
import { axiosPut } from "../../axiosServices";

const EditDetailsModal = ({ empById, setEditModal }) => {
    const { firstname, lastname, email, phone, job, dateofjoining, image } = empById;
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const handleEdit = async (values) => {
        setLoading(true);
        const formData = new FormData();
        Object.keys(values).forEach((key) => formData.append(key, values[key]));
        if (imageFile) formData.append('image', imageFile);

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
            firstname,
            lastname,
            email,
            phone,
            job,
            dateofjoining,
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
            // Upload image to Cloudinary
            const response = await axios.post('https://api.cloudinary.com/v1_1/dn0dey1h5/image/upload', formData);
            setImageFile(response.data.secure_url); // Save the secure URL of the uploaded image
        } catch (err) {
            console.error('Error uploading image:', err);
        }
    };

    return (
        <div className="modalContainer">
            <form onSubmit={formik.handleSubmit}>
                <div className="modalBox">
                    <div className="modalHeader">
                        <h2>Edit Employee Details</h2>
                    </div>
                    <div className="modalInner">
                        <div className="input-container">
                            <div className="input-box">
                                <label>First Name</label>
                                <input type="text" name="firstname" onChange={formik.handleChange} value={formik.values.firstname} required />
                            </div>
                            <div className="input-box">
                                <label>Last Name</label>
                                <input type="text" name="lastname" onChange={formik.handleChange} value={formik.values.lastname} required />
                            </div>
                        </div>
                        <div className="input-box">
                            <label>Image</label>
                            <input type="file" name="image" onChange={handleImageChange} />
                        </div>
                        <div className="input-container">
                            <div className="input-box">
                                <label>Email Address</label>
                                <input type="email" name="email" onChange={formik.handleChange} value={formik.values.email} required />
                            </div>
                            <div className="input-box">
                                <label>Phone</label>
                                <input type="text" name="phone" onChange={formik.handleChange} value={formik.values.phone} required />
                            </div>
                        </div>
                        <div className="modalFooter">
                            <button type="submit" className="add-btn">
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
