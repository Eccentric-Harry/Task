import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import './TopNav.css';

const TopNav = () => {
    const { admin, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove token and admin data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('admin');

        // Dispatch logout action
        dispatch(logout());
        
        navigate('/login');
    };

    return (
        <div className="top-nav">
            <div className="logo">Employee Management</div>
            {isAuthenticated && (
                <ul className="nav-list">
                    <li onClick={() => navigate('/home')}>Home</li>
                    <li onClick={() => navigate('/')}>Employee List</li>
                    <li>{admin?.username}</li>
                    <li onClick={handleLogout} className="logout-button">
                        Logout
                    </li>
                </ul>
            )}
        </div>
    );
};

export default TopNav;
