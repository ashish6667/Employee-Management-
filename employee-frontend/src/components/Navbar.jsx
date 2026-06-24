import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 px-4 py-4 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/employees" className="text-xl font-bold">
          Employee Management
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/employees"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-700"
          >
            Employees
          </Link>

          <Link
            to="/add-employee"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100"
          >
            + Add Employee
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;