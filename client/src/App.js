import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from './store';
import TopNav from './components/TopNav/TopNav';
import LeftNav from './components/LeftNav/LeftNav';
import MainSection from './components/MainSection/MainSection';
import Login from './pages/Login.jsx';
import ProtectedRoute from './ProtectedRoute';
import Home from './pages/Home';

function App() {
    const [employeeId, setEmployeeId] = useState('');
    const [showLeftNav, setShowLeftNav] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth); // Get authentication state from redux

    const handleEmployeeSelect = (id) => {
        setEmployeeId(id);
        setShowLeftNav(true);
    };

    useEffect(() => {
        // Check if user is authenticated on page load
        if (localStorage.getItem('token')) {
            // If there's a token in localStorage, mark the user as authenticated
            // Optionally, you can dispatch a redux action to set the user state
        }
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <TopNav />
                    <Routes>
                        {/* Public Route: Login */}
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />

                        {/* Protected Routes */}
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />

                        {/* Default Route - home or login */}
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <div className="main-content">
                                        {showLeftNav && <LeftNav employeeId={employeeId} />}
                                        <MainSection setEmployeeId={handleEmployeeSelect} showLeftNav={showLeftNav} />
                                    </div>
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
