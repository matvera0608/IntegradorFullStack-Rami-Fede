import React, { useState } from 'react';
import '../styles/createUser.css';
import { useNavigate } from 'react-router-dom';
function CreateUser() {
  const [formData, setFormData] = useState({
    nombre: '',
    correoElectronico: '',
    contrasena: '',
    telefono: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();
  
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Datos del formulario:', formData);
    setShowSuccess(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: formData.nombre,
            email: formData.correoElectronico,
            password: formData.contrasena,
          })
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Usuario creado exitosamente:', data);
          // Redirigir al usuario a la página de login después de un registro exitoso
          navigate('/login');
        } else {
          console.error('Error al crear el usuario:', data);
        }
      
    } catch (error) {
      
    }
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <>
      <div className="create-container">
        <h1 className="create-title">Crear Usuario</h1>
        <p className="create-subtitle">Completa los datos para registrar un nuevo usuario</p>
        
        {showSuccess && (
          <div className="create-success-message">
            ¡Usuario creado exitosamente!
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-form">
          <div className="create-form-group">
            <label htmlFor="create-nombre" className="create-label">
              Nombre Completo <span className="create-required">*</span>
            </label>
            <input 
              type="text" 
              id="create-nombre" 
              name="nombre" 
              maxLength="100" 
              required
              value={formData.nombre} 
              onChange={handleChange}
              className="create-input"
            />
            <div className="create-error-message">Por favor ingresa un nombre válido</div>
          </div>

          <div className="create-form-group">
            <label htmlFor="create-correoElectronico" className="create-label">
              Correo Electrónico <span className="create-required">*</span>
            </label>
            <input 
              type="email" 
              id="create-correoElectronico"
              name="correoElectronico" 
              maxLength="150" 
              required
              value={formData.correoElectronico} 
              onChange={handleChange}
              className="create-input"
            /> 
            <div className="create-error-message">Por favor ingresa un correo válido</div>
          </div>

          <div className="create-form-group">
            <label htmlFor="create-contrasena" className="create-label">
              Contraseña <span className="create-required">*</span>
            </label>
            <div className="create-password-toggle">
              <input 
                type={showPassword ? "text" : "password"}
                id="create-contrasena" 
                name="contrasena" 
                maxLength="255" 
                required
                value={formData.contrasena}
                onChange={handleChange}
                className="create-input"
              />
              <button 
                type="button" 
                className="create-toggle-btn" 
                onClick={togglePassword}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <p className="create-info-text">Mínimo 8 caracteres</p>
            <div className="create-error-message">La contraseña debe tener al menos 8 caracteres</div>
          </div>
          <button type="submit" className="create-btn-submit">Crear Usuario</button>
        </form>
      </div>

      <footer className="create-footer">
        <div className="create-footer-container">
          <span className="create-footer-copyright">&copy; 2025 Hotel Paradise. Todos los derechos reservados.</span>
          <div className="create-footer-links">
            <a href="#" className="create-footer-link">Ayuda</a>
            <a href="#" className="create-footer-link">Contacto</a>
            <a href="#" className="create-footer-link">Términos</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default CreateUser;