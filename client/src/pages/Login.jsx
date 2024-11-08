import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png'; // Ensure logo is imported correctly

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3100/admin/login', { username, password });
            const { admin, token } = response.data;

            // Save token and admin data to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('admin', JSON.stringify(admin)); // Save admin data as string
            
            // Dispatch login action
            dispatch(login({ admin, token }));
            
            alert('Login successful');
            navigate('/home');
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white p-6">
            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-sm">
                <div className="flex justify-center mb-6">
                    {/* Display logo with size adjustments */}
                    <img src={logo} alt="Logo" className="w-20 h-20 mb-4" />
                </div>
                <h2 className="text-3xl font-semibold text-green-800 mb-6 text-center">
                    Admin Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
