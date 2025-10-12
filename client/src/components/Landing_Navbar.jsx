import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isHomePage = location.pathname === '/home';

  // Función para decodificar el JWT
  const getUserRole = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica la parte del payload
      return payload.rol; // Asumiendo que tu JWT tiene "rol" en el payload
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  };

  const role = getUserRole();
  const isAdmin = role === 'admin';
  const isUser = role === 'usuario';

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

            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  <i className="bi bi-shield-lock me-1"></i>
                  <p>Admin Panel</p>
                </Link>
              </li>
            )}
            {(isUser &&
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  <i className="bi bi-shield-lock me-1"></i>
                  <p>Menu Principal</p>
                </Link>
              </li>
            )}

            {token ? (
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={handleLogout}
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
