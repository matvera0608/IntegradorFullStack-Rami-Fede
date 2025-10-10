import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
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
                    email: formData.username,
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
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Iniciar Sesión</h1>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="login-alert login-alert-danger login-mb-3">
                            {error}
                        </div>
                    )}
                    <div className="login-input-group login-mb-3">
                        <input 
                            type="email" 
                            id="login-username" 
                            name="username" 
                            required 
                            placeholder="Correo electrónico"
                            value={formData.username} 
                            onChange={handleChange}
                            className="login-input"
                        />
                    </div>

                    <div className="login-input-group login-mb-3">
                        <input 
                            type="password" 
                            id="login-password" 
                            name="password" 
                            required 
                            placeholder="Contraseña"
                            value={formData.password}             
                            onChange={handleChange}
                            className="login-input"
                        />
                    </div>

                    <button 
                        type="submit" 
                        id="login-button" 
                        className="login-btn login-btn-primary login-w-100 login-mb-3"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                
                <div className="login-footer">
                    <a href="#" className="login-forgot-password">¿Olvidaste tu contraseña?</a>
                </div>
                 <div className="login-footer">
                    <Link to="/register" className="login-forgot-password ">
                    ¿No tienes cuenta? Regístrate Aquí.
                </Link>
                </div>
                
            </div>
            
            <footer className="login-footer-bottom">
                <div className="login-footer-container">
                    <span className="login-footer-copyright">&copy; 2025 Hotel Paradise. Todos los derechos reservados.</span>
                    <div className="login-footer-links">
                        <a href="#" className="login-footer-link">Ayuda</a>
                        <a href="#" className="login-footer-link">Contacto</a>
                        <a href="#" className="login-footer-link">Términos</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;