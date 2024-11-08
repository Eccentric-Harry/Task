import React, { useEffect, useState } from 'react';
import { axiosGet } from '../../axiosServices';

const LeftNav = ({ employeeId }) => {
  const [empById, setEmpById] = useState([]);

  const getEmployeeById = async () => {
    try {
      const res = await axiosGet(`/employee/${employeeId}`);
      setEmpById(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getEmployeeById();
  }, [employeeId]);

  return (
    <nav className="w-64 bg-white shadow-lg p-6 rounded-lg">
      <div className="employeeDetail">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Full Detail</h2>
        <div className="flex justify-center mb-4">
          <img
            src={empById.image}
            alt={`${empById.firstname} ${empById.lastname}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {empById.firstname} {empById.lastname}
        </h1>
        <p className="text-gray-600 mb-2">{empById.email}</p>
        <p className="text-gray-600 mb-2">{empById.phone}</p>
        <p className="text-gray-600 mb-2">{empById.job}</p>
        <p className="text-sm text-gray-500">{empById.dateofjoining}</p>
      </div>
    </nav>
  );
};

export default LeftNav;
