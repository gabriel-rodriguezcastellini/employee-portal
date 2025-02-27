import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://localhost:5001";

function NewEmployee() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    hireDate: "",
    departmentId: "",
    phone: "",
    address: "",
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDepartments() {
      const response = await axios.get(`${API_BASE_URL}/api/departments`, {
        headers: {
          "X-API-KEY": "secret-key",
        },
      });
      setDepartments(response.data);
    }
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...employee,
        departmentId: parseInt(employee.departmentId, 10),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/employees`,
        payload
      );
      if (response.status === 201 || response.status === 200) {
        navigate("/employees");
      }
    } catch (err) {
      setError("Error creating employee");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Employee</h1>
      {error && (
        <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            value={employee.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            value={employee.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">
            Hire Date:
          </label>
          <input
            type="date"
            name="hireDate"
            value={employee.hireDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">
            Department:
          </label>
          <select
            name="departmentId"
            value={employee.departmentId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Phone:</label>
          <input
            type="text"
            name="phone"
            value={employee.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Address:</label>
          <input
            type="text"
            name="address"
            value={employee.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Create Employee
        </button>
      </form>
    </div>
  );
}

export default NewEmployee;
