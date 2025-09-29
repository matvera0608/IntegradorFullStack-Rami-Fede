import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Si ya hay un token, redirigir al menu principal
            navigate('/home');
        }
    }, [navigate]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

        if(error)
        {
            setError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try
        {
            console.log('Datos de login:', formData);

            // Llamada a tu API de autenticación
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.username, // o username según tu API
                    password: formData.password
                })
            });

            const data = await response.json()

            if (response.ok) 
            {
                console.log('Login exitoso:', data)
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                navigate('/home');
                
            } 
            else 
            {
                // Si hay error en el login
                setError(data.message || 'Error en las credenciales');
            }
        } catch (error) 
        {
            setError('Error en la autenticación');
        } finally
        {
            setLoading(false)
        }
    };

    return (
        <div className="login-page"> {/* WRAPPER PRINCIPAL - esto es clave */}
            <div className="login-container">
                <div className="login-header">
                    <h1>Iniciar Sesión</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-danger mb-3">
                            {error}
                        </div>
                    )}
                    <div className="input-group mb-3">
                        <input 
                            type="email" 
                            id="username" 
                            name="username" 
                            required 
                            placeholder="Correo electrónico"
                            value={formData.username} 
                            onChange={handleChange}               
                        />
                    </div>

                    <div className="input-group mb-3">
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required 
                            placeholder="Contraseña"
                            value={formData.password}             
                            onChange={handleChange}               // 👈 vincular
                        />
                    </div>

                    <button type="submit" id="login-button" className="btn btn-primary w-100 mb-3">
                        Iniciar Sesión
                    </button>
                </form>
                
                <div className="login-footer">
                    <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                </div>
            </div>
            
            <footer className="footer">
                <div className="container">
                    <span>&copy; 2025 Hotel Paradise. Todos los derechos reservados.</span>
                    <div className="footer-links">
                        <a href="#">Ayuda</a>
                        <a href="#">Contacto</a>
                        <a href="#">Términos</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;