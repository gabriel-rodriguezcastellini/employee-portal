import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://localhost:5001";

function EmployeeDetails() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const empResponse = await axios.get(
          `${API_BASE_URL}/api/employees/${id}`,
          {
            headers: { "X-API-KEY": "secret-key" },
          }
        );
        const deptResponse = await axios.get(
          `${API_BASE_URL}/api/departments`,
          {
            headers: { "X-API-KEY": "secret-key" },
          }
        );

        const empData = empResponse.data;
        const deptData = deptResponse.data;

        setEmployee(empData);
        setDepartments(deptData);
        setSelectedDept(empData.departmentId);
      } catch (err) {
        setError("Error loading employee details");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleUpdateDepartment = async () => {
    try {
      const deptId = parseInt(selectedDept, 10);
      const payload = {
        ...employee,
        departmentId: deptId,
      };
      await axios.put(`${API_BASE_URL}/api/employees/${id}`, payload, {
        headers: { "X-API-KEY": "secret-key" },
      });
      setEmployee((prev) => ({
        ...prev,
        departmentId: deptId,
      }));
      setSuccess("Department updated successfully!");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError("Error updating department");
    }
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
      <p className="text-center mt-8 text-gray-600">
        Loading employee details...
      </p>
    );
  }

  if (!employee) {
    return (
      <p className="text-center mt-8 text-red-600">
        {error || "Employee not found."}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {error && (
        <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">
          {success}
        </div>
      )}

      <div className="flex border border-gray-200 shadow-sm p-4 rounded">
        <img
          src="https://placehold.co/50x50?text=Avatar"
          alt="Avatar"
          className="w-48 h-48 object-cover mr-4"
        />

        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xl font-semibold">
              {employee.firstName} {employee.lastName}
            </div>
            <div className="text-right">
              <div>{formatDate(employee.hireDate)}</div>
              <div className="text-sm text-gray-500">
                ({getTenureString(employee.hireDate)})
              </div>
            </div>
          </div>

          <div className="space-y-1 text-gray-700 mb-4">
            <div>Employee ID: {employee.id}</div>
            <div>Department: {employee.departmentName}</div>
            <div>Telephone: {employee.phone}</div>
            <div>Address: {employee.address}</div>
          </div>

          <div className="mt-4 p-4 border rounded shadow-sm">
            <label className="block mb-2 font-semibold text-gray-700">
              Update Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full mb-2"
              required
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleUpdateDepartment}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
