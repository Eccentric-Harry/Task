import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { axiosDelete } from "../../../axiosServices";

const Card = ({ empData, handleEdit, handleReRender }) => {
  const { name, email, mobile, designation, gender, course, image } = empData;
  const [dropDown, setDropdown] = useState(false);

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const res = await axiosDelete(`/employee/${id}`);
      console.log(res);
      handleReRender();
      setDropdown(false); // Close the dropdown after deletion
    } catch (err) {
      console.log(err);
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent card click event
    setDropdown(!dropDown);
  };

  return (
    <div className="max-w-xs w-full bg-white rounded-lg shadow-lg overflow-hidden h-[400px] flex flex-col relative">
      <div className="relative flex-grow">
        {/* Three dots icon */}
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={toggleDropdown}
        >
          <BsThreeDotsVertical size={20} />
        </div>

        {/* Dropdown menu */}
        {dropDown && (
          <ul
            className="absolute right-2 top-10 bg-white shadow-md rounded-lg py-2 w-32 text-sm text-gray-700 z-10"
            onMouseLeave={() => setDropdown(false)}
          >
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(empData._id);
                setDropdown(false);
              }}
            >
              Edit
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(empData._id);
              }}
            >
              Delete
            </li>
          </ul>
        )}
      </div>

      {/* Employee image and details */}
      <div className="flex justify-center pt-4">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-sm text-gray-500 mb-1">{email}</p>
        <p className="text-sm text-gray-500 mb-1">Mobile: {mobile}</p>
        <p className="text-sm text-gray-500 mb-1">Designation: {designation}</p>
        <p className="text-sm text-gray-500 mb-1">Course: {course}</p>
        <p className="text-sm text-gray-500 mb-1">Gender: {gender}</p>
      </div>
    </div>
  );
};

export default Card;
