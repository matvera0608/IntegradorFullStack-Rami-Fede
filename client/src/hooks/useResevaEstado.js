// hooks/useReservaEstado.js
// hook personalizado para cambiar la card de reservas del menu principal
import { useState, useEffect } from 'react';
import { 
    obtenerDetallesReservaActiva, 
    validarPuedeReservar,
    decodeToken 
} from '../utils/ReserveActive';

export const useReservaEstado = () => {
    const [estadoReserva, setEstadoReserva] = useState('cargando');
    const [reservaDetalles, setReservaDetalles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verificarEstadoReserva = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setEstadoReserva('no-autenticado');
                    setLoading(false);
                    return;
                }

                // Obtener validación completa
                const validacion = await validarPuedeReservar(token);
                
                if (validacion.reservaActual) {
                    const estado = validacion.reservaActual.estado?.toLowerCase();
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    
                    const fechaIngreso = new Date(validacion.reservaActual.fechaIngreso);
                    fechaIngreso.setHours(0, 0, 0, 0);
                    
                    const fechaEgreso = new Date(validacion.reservaActual.fechaEgreso);
                    fechaEgreso.setHours(0, 0, 0, 0);

                    // Determinar estado específico basado en fechas y estado
                    if (estado === 'activo' && hoy >= fechaIngreso && hoy <= fechaEgreso) {
                        setEstadoReserva('activa-hoy');
                    } else if (estado === 'activo' && hoy < fechaIngreso) {
                        setEstadoReserva('activa-futura');
                    } else if (estado === 'pendiente') {
                        setEstadoReserva('pendiente');
                    } else if (estado === 'autorizado' && hoy >= fechaIngreso && hoy <= fechaEgreso) {
                        setEstadoReserva('activa-hoy');
                    } else if (estado === 'autorizado' && hoy < fechaIngreso) {
                        setEstadoReserva('activa-futura');
                    } else if (estado === 'finalizado') {
                        setEstadoReserva('finalizada');
                    } else if (estado === 'cancelado') {
                        setEstadoReserva('cancelada');
                    } else {
                        setEstadoReserva('otro-estado');
                    }
                    
                    setReservaDetalles(validacion.reservaActual);
                } else {
                    setEstadoReserva('sin-reserva');
                    setReservaDetalles(null);
                }

            } catch (err) {
                console.error('Error al verificar estado de reserva:', err);
                setError(err.message);
                setEstadoReserva('error');
            } finally {
                setLoading(false);
            }
        };

        verificarEstadoReserva();
    }, []);

    return {
        estadoReserva,
        reservaDetalles,
        loading,
        error
    };
};