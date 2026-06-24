import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import api from "../services/api";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (searchValue = "") => {
    try {
      setLoading(true);

      const response = await api.get("/employees", {
        params: {
          search: searchValue,
        },
      });

      setEmployees(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!isConfirmed) return;

    try {
      await api.delete(`/employees/${id}`);

      toast.success("Employee deleted successfully");
      fetchEmployees(search);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete employee"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Employee List
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View, search, edit, and delete employee records.
            </p>
          </div>

          <Link
            to="/add-employee"
            className="rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white hover:bg-blue-700"
          >
            + Add Employee
          </Link>
        </div>

        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Search Employee by Name
          </label>

          <input
            type="text"
            placeholder="Example: Ashish"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="hidden overflow-x-auto rounded-xl bg-white shadow-md md:block">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-left text-sm text-gray-700">
              <tr>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Phone</th>
                <th className="px-4 py-4">Department</th>
                <th className="px-4 py-4">Position</th>
                <th className="px-4 py-4">Salary</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center">
                    Loading employees...
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((employee) => (
                  <tr
                    key={employee._id}
                    className="border-t text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-semibold">
                      {employee.name}
                    </td>
                    <td className="px-4 py-4">{employee.email}</td>
                    <td className="px-4 py-4">{employee.phone}</td>
                    <td className="px-4 py-4">{employee.department}</td>
                    <td className="px-4 py-4">{employee.position}</td>
                    <td className="px-4 py-4">
                      ₹{employee.salary.toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/edit-employee/${employee._id}`}
                          className="rounded-md bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-black hover:bg-yellow-500"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-md">
              Loading employees...
            </div>
          ) : employees.length > 0 ? (
            employees.map((employee) => (
              <div
                key={employee._id}
                className="rounded-xl bg-white p-5 shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {employee.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {employee.position}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {employee.department}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-700">Email:</span>{" "}
                    {employee.email}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-700">Phone:</span>{" "}
                    {employee.phone}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-700">Salary:</span>{" "}
                    ₹{employee.salary.toLocaleString()}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    to={`/edit-employee/${employee._id}`}
                    className="flex-1 rounded-lg bg-yellow-400 px-3 py-2 text-center text-sm font-semibold text-black hover:bg-yellow-500"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-md">
              No employees found.
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default EmployeeList;