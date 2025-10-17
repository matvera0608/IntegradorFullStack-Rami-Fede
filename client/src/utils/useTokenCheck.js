import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useTokenCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      
      // Si no hay token, redirige al login
      if (!token) {
        localStorage.removeItem('userData');
        navigate('/login');
        return;
      }

      try {
        // Decodificar el token para ver si expiró
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiraEn = payload.exp * 1000; // Convertir a milisegundos
        const ahora = Date.now();

        // Si el token expiró, redirige al login
        if (ahora >= expiraEn) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          navigate('/login');
        }
      } catch (error) {
        // Si hay error decodificando, token inválido
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
      }
    };

    // Verificar inmediatamente
    checkToken();

    // Verificar cada 30 segundos
    const interval = setInterval(checkToken, 30000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [navigate]);
};