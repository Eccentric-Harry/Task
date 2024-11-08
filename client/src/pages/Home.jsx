import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
    const admin = useSelector((state) => state.auth.admin);

    return (
        <div className="home-container">
            <h1>Welcome Admin, {admin?.username}!</h1>
        </div>
    );
};

export default Home;
