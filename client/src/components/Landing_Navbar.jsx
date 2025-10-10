import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css'; // Asegúrate de tener los estilos necesarios

function Navbar() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token');
  const isHomePage = location.pathname === '/home';

  // Mostrar logout si está autenticado O si está en /home
  const showLogout = isAuthenticated || isHomePage;

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-building fs-2 me-2"></i>Hotel Paradise
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house-door me-1"></i>
                <p>Inicio</p>
              </Link>
            </li>
            
            {showLogout ? (
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={handleLogout}
                  style={{ border: 'none', background: 'transparent', color: 'inherit' }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> 
                  <p>Logout</p>
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i> 
                  <p>Login</p>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;