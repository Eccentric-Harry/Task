import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3100/admin/login', { username, password });
            dispatch(login({ admin: response.data.admin, token: response.data.token }));
            alert('Login successful');
            navigate('/home');
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
