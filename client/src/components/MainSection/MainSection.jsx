import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import Card from "./components/Card";
import ModelPopup from "../ModelPopup/ModelPopup";
import EditDetailsModal from "../ModelPopup/EditDetailsModal";
import EmployeeDetailModal from "./components/EmployeeDetailModal";
import { axiosGet } from "../../axiosServices";

const MainSection = ({ setEmployeeId, showLeftNav }) => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [empById, setEmpById] = useState({});
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [reRender, setReRender] = useState(false);

  // Fetch all employees
  const getAllEmployee = async () => {
    try {
      const res = await axiosGet("/employee");
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch employee by ID
  const getEmployeeById = async (id) => {
    try {
      const res = await axiosGet(`/employee/${id}`);
      setEmpById(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Search employees by input value
  const handleSearch = async (e) => {
    try {
      const res = await axiosGet(`/employee/search/${e.target.value}`);
      setEmployees(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Handle edit modal
  const handleEdit = async (id) => {
    await getEmployeeById(id);
    setEditModal(true);
  };

  // Trigger a re-render after editing or deleting an employee
  const handleReRender = () => {
    setReRender(true);
  };

  // Handle card click to show employee details
  const handleCardClick = (empData) => {
    setSelectedEmp(empData);
    setDetailModal(true);
  };

  // Close the detail modal
  const closeDetailModal = () => {
    setDetailModal(false);
    setSelectedEmp(null);
  };

  // Fetch all employees when component mounts or state updates
  useEffect(() => {
    getAllEmployee();
    setReRender(false);
  }, [showModal, editModal, reRender]);

  return (
    <>
      {/* Add Employee Modal */}
      {showModal && <ModelPopup setShowModal={setShowModal} />}
      
      {/* Edit Employee Modal */}
      {editModal && <EditDetailsModal setEditModal={setEditModal} empById={empById} />}

      {/* Employee Detail Modal */}
      {detailModal && <EmployeeDetailModal empData={selectedEmp} closeModal={closeDetailModal} />}

      <main className={`mainContainer ${showLeftNav ? "shifted" : ""}`}>
        <div className="mainWrapper p-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Employees <span className="text-lg text-gray-500">({employees.length})</span>
          </h1>

          {/* Search Bar and Add Button */}
          <div className="employeeHeader flex justify-between items-center mb-6">
            <div className="searchBox flex items-center space-x-2 p-2 rounded-lg border border-gray-300 w-full max-w-md">
              <input
                type="text"
                placeholder="Search by name, email, mobile, etc."
                className="w-full p-2 text-gray-700 outline-none"
                onChange={handleSearch}
              />
              <BiSearch size={20} className="text-gray-500" />
            </div>

            <button
              className="add-btn flex items-center bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowModal(true)}
            >
              <IoMdAdd size={20} />
              Add Employee
            </button>
          </div>

          {/* Employee Cards Section */}
          <div className="employees grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {employees && employees.map((emp) => (
              <div key={emp._id} onClick={() => handleCardClick(emp)}>
                <Card
                  empData={emp}
                  handleEdit={handleEdit}
                  handleReRender={handleReRender}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default MainSection;
