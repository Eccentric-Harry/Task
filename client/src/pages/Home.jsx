import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
    const admin = useSelector((state) => state.auth.admin);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full">
                <h1 className="text-4xl font-semibold text-[#388E3C] text-center">
                    Welcome Admin, <span className="text-[#2C6B2F]">{admin?.username}</span>!
                </h1>
                <p className="text-lg text-gray-600 mt-4 text-center">
                    You have full access to manage the employee records. 
                    Enjoy your time managing the system with ease.
                </p>
            </div>
        </div>
    );
};

export default Home;
