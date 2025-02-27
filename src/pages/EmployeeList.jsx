import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://localhost:5001";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/employees`, {
          headers: {
            "X-API-KEY": "secret-key",
          },
        });
        setEmployees(response.data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    await axios.delete(`${API_BASE_URL}/api/employees/${id}`, {
      headers: {
        "X-API-KEY": "secret-key",
      },
    });
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTenureString = (hireDateStr) => {
    const hireDate = new Date(hireDateStr);
    const now = new Date();
    let years = now.getFullYear() - hireDate.getFullYear();
    let months = now.getMonth() - hireDate.getMonth();
    let days = now.getDate() - hireDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years}y – ${months}m – ${days}d`;
  };

  if (isLoading) {
    return (
      <p className="text-center mt-8 text-gray-600">Loading employees...</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Link to="/employees/new">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
            New Employee
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="flex items-center p-4 border border-gray-200 rounded shadow-sm"
          >
            <img
              src="https://placehold.co/50x50?text=Avatar"
              alt="Avatar"
              className="w-12 h-12 rounded mr-4"
            />
            <div className="flex-grow">
              <div className="font-semibold text-gray-800">
                {emp.firstName} {emp.lastName}{" "}
                <span className="text-gray-500">({emp.departmentName})</span>
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(emp.hireDate)}{" "}
                <span className="text-xs text-gray-400">
                  ({getTenureString(emp.hireDate)})
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link to={`/employees/${emp.id}`}>
                <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded">
                  View Details
                </button>
              </Link>
              <button
                onClick={() => handleDelete(emp.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeList;
