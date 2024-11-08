import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import logo from '../../logo.png'; // Import your logo here

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
        
        // Redirect to login page
        navigate('/login');
    };

    return (
        <div className="bg-white p-4 flex justify-between items-center shadow-md">
            <div
                className="text-3xl font-bold cursor-pointer"
                onClick={() => navigate('/home')}
            >
                <img src={logo} alt="Dealsdray" className="h-10 w-auto" />
            </div>
            {isAuthenticated && (
                <ul className="flex space-x-8 justify-center items-center">
                    <li
                        className="text-lg font-medium text-gray-700 hover:text-green-600 cursor-pointer transition duration-200"
                        onClick={() => navigate('/home')}
                    >
                        Home
                    </li>
                    <li
                        className="text-lg font-medium text-gray-700 hover:text-green-600 cursor-pointer transition duration-200"
                        onClick={() => navigate('/')}
                    >
                        Employee List
                    </li>
                    <li className="text-lg font-medium text-gray-700">
                        {admin?.username}
                    </li>
                    <li
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg cursor-pointer transition duration-300"
                    >
                        Logout
                    </li>
                </ul>
            )}
        </div>
    );
};

export default TopNav;
