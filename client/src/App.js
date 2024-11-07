import { useState } from 'react';
import './App.css';
import LeftNav from './components/LeftNav/LeftNav';
import MainSection from './components/MainSection/MainSection';
import TopNav from './components/TopNav/TopNav';

function App() {
  const [employeeId, setEmployeeId] = useState('');
  const [showLeftNav, setShowLeftNav] = useState(false);

  const handleEmployeeSelect = (id) => {
    setEmployeeId(id);
    setShowLeftNav(true);  // Show LeftNav when an employee is selected
  };

  return (
    <div className="App">
      <TopNav />
      {showLeftNav && <LeftNav employeeId={employeeId} />}  {/* Conditionally render LeftNav */}
      <MainSection setEmployeeId={handleEmployeeSelect} showLeftNav={showLeftNav} />  {/* Pass showLeftNav as a prop */}
    </div>
  );
}

export default App;
