import React from "react";
import { IoMdClose } from "react-icons/io";

const EmployeeDetailModal = ({ empData, closeModal }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <IoMdClose size={24} />
        </button>

        {/* Employee Details */}
        <div className="text-center">
          {/* Profile Image */}
          <img
            src={empData?.image || "/default-avatar.png"}
            alt={`${empData?.name}`}
            className="w-24 h-24 mx-auto rounded-full object-cover"
          />
          
          {/* Name */}
          <h2 className="text-2xl font-semibold mt-4">{empData?.name}</h2>

          {/* Email */}
          <p className="text-gray-600">{empData?.email}</p>

          {/* Mobile Number */}
          <p className="text-gray-600">{empData?.mobile}</p>

          {/* Designation */}
          <p className="text-gray-600">{empData?.designation}</p>

          {/* Gender */}
          <p className="text-gray-600">Gender: {empData?.gender === 'M' ? 'Male' : 'Female'}</p>

          {/* Course */}
          <p className="text-gray-600">Course: {empData?.course}</p>

          {/* Additional styling or information can be added here */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
