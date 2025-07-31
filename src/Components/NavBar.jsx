// src/Components/NavBar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export const NavBar = () => {
  const { signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center p-2 rounded ${
      isActive ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-50 dark:bg-gray-800">
      <ul className="mt-10 space-y-4">
        <li>
          <NavLink to="/dashboard" className={linkClass}>
            {/* icono */}
            <span className="ml-3">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/product" className={linkClass}>
            {/* icono */}
            <span className="ml-3">Products</span>
          </NavLink>
        </li>
        <li>
          <button
            onClick={handleSignOut}
            className="w-full text-left flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {/* icono */}
            <span className="ml-3">Sign Out</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};
