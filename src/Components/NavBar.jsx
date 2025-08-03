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

  const linkClass = ({ isActive }) => {
    const baseClasses = "flex items-center p-3 rounded-lg transition-all duration-200";
    const activeClasses = "bg-blue-chill-700 text-white shadow-md";
    const inactiveClasses = "text-polar-200 hover:bg-shark-800 hover:text-polar-100";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <aside 
      className="fixed top-0 left-0 w-64 h-screen"
      style={{
        backgroundColor: 'var(--color-shark-950)',
        borderRight: '1px solid var(--color-shark-700)'
      }}
    >
      <div className="p-4 border-b border-shark-700">
        <h1 
          className="text-xl font-bold"
          style={{ color: 'var(--color-polar-200)' }}
        >
          Sistema de Ventas
        </h1>
      </div>
      
      <ul className="mt-6 p-4 space-y-2">
      {/*  <li>
          <NavLink to="/dashboard" className={linkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--color-polar-200)' }}>
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="ml-3">Dashboard</span>
          </NavLink>
        </li>
      */}
        <li>
          <NavLink to="/productos" className={linkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--color-polar-200)' }}>
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            <span className="ml-3">Productos</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/ventas" className={linkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--color-polar-200)' }}>
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span className="ml-3">Ventas</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/nueva-venta" className={linkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--color-polar-200)' }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="ml-3">Nueva Venta</span>
          </NavLink>
        </li>
      </ul>
      
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-shark-700">
        <button
          onClick={handleSignOut}
          className="w-full text-left flex items-center p-3 rounded-lg transition-all duration-200"
          style={{
            color: 'var(--color-polar-200)',
            backgroundColor: 'transparent'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-shark-800)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--color-polar-200)' }}>
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span className="ml-3">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};