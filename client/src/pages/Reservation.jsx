import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRoomStatus } from '../hooks/useRooms';
import { 
    validarCapacidad, 
    calcularFechasSugeridaConCapacidad,
    obtenerEstadisticasOcupacion 
} from '../utils/reservationUtils';
import { validarPuedeReservar } from '../utils/ReserveActive';
import { formatearFecha } from '../utils/formatDate';
import '../styles/Reservation.css';
const CAPACIDAD_TOTAL = 10;

const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};

const Reservation = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    if (!token) navigate('/login');

    const { roomsStatus: rooms, reservasActivas, loading, error } = useRoomStatus();
    const { user, loading: authLoading } = useAuth();

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [puedeReservar, setPuedeReservar] = useState(true);
    const [mensajeBloqueo, setMensajeBloqueo] = useState('');
    const [reservaActual, setReservaActual] = useState(null);
    const [validandoReserva, setValidandoReserva] = useState(true);

    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        phone: '',
        guests: '',
        comments: ''
    });

    const [fechasSugeridas, setFechasSugeridas] = useState({ 
        checkIn: '', 
        checkOut: '',
        mensaje: '',
        disponibles: CAPACIDAD_TOTAL
    });

    const formRef = useRef(null);

    // Validar si el usuario puede reservar
    useEffect(() => {
        const verificarEstadoReserva = async () => {
            try {
                setValidandoReserva(true);
                const validacion = await validarPuedeReservar(token);
                setPuedeReservar(validacion.puedeReservar);
                setMensajeBloqueo(validacion.motivo);
                setReservaActual(validacion.reservaActual);
            } catch (error) {
                console.error('Error al validar estado de reserva:', error);
            } finally {
                setValidandoReserva(false);
            }
        };

        if (token) verificarEstadoReserva();
    }, [token]);

    // Manejo de inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Selección de habitación específica
    const handleSeleccionar = (room) => {
        if (!puedeReservar) {
            alert(mensajeBloqueo);
            return;
        }

        setSelectedRoom({
            ...room,
            idNumero: room.idNumero // ID de habitacion_numero
        });

        const fechas = calcularFechasSugeridaConCapacidad(
            room.id, 
            reservasActivas, 
            CAPACIDAD_TOTAL
        );
        setFechasSugeridas(fechas);

        setFormData(prev => ({
            ...prev,
            checkIn: fechas.checkIn,
            checkOut: fechas.checkOut,
            phone: '',
            guests: '',
            comments: ''
        }));

        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
    };
    // Crear reserva
    const handleReserve = async (e) => {
        e.preventDefault();

        if (!puedeReservar) {
            alert(`No puedes realizar esta reserva\n\n${mensajeBloqueo}`);
            return;
        }

        if (!formData.checkIn || !formData.checkOut) {
            alert('Por favor, selecciona ambas fechas (check-in y check-out)');
            return;
        }

        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            alert('La fecha de check-in no puede ser anterior a hoy');
            return;
        }

        if (checkOutDate <= checkInDate) {
            alert('La fecha de check-out debe ser posterior a la fecha de check-in');
            return;
        }

        const validacion = validarCapacidad(
            selectedRoom.id,
            formData.checkIn, 
            formData.checkOut, 
            reservasActivas,
            CAPACIDAD_TOTAL
        );

        if (!validacion.disponible) {
            alert(
                `No hay disponibilidad en las fechas seleccionadas.\n` +
                `Check-In sugerido: ${fechasSugeridas.checkIn}\n` +
                `Check-Out sugerido: ${fechasSugeridas.checkOut}\n` +
                `Disponibles: ${fechasSugeridas.disponibles}/${CAPACIDAD_TOTAL}`
            );
            return;
        }

        try {
            const decodedToken = decodeToken(token);
            const priceFeature = selectedRoom.features.find(f => f.toLowerCase().includes('precio'));
            const precio = priceFeature ? parseInt(priceFeature.match(/\d+/)[0]) : 0;

            // Enviar solo el tipo de habitación (IDHabitacion) y el backend asignará un número disponible
            const reservationData = {
                fechaIngreso: formData.checkIn,
                fechaEgreso: formData.checkOut,
                estado: 'pendiente',
                precio: precio,
                IDHabitacion: selectedRoom.id,  // ✅ solo tipo de habitación
                IDUsuario: decodedToken.IDUsuario || decodedToken.id
            };

            const response = await fetch('http://localhost:8080/api/reservations/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservationData)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || `Error ${response.status}`);

            alert(`Reserva creada con éxito. Habitación: ${selectedRoom.type}, Estado: Pendiente`);

            // Recargar para actualizar disponibilidad
            window.location.reload();
        } catch (error) {
            console.error('Error al crear reserva:', error);
            alert('Error al crear la reserva: ' + error.message);
        }
    };


    // Retornos de carga o error
    if (loading || authLoading || validandoReserva) return <div>Cargando habitaciones...</div>;
    if (error) return <div>Error al cargar habitaciones: {error}</div>;

return (
    <div className="reservation-page">
        <section className="reservation-hero">
            <div className="reservation-container">
                <h1 className="reservation-title">Reserva tu Habitación</h1>
                <p className="reservation-subtitle">Elige la habitación perfecta para tu estadía</p>
            </div>
        </section>

        {/* ALERTA SI NO PUEDE RESERVAR */}
        {!puedeReservar && reservaActual && (
            <section className="reservation-blocked-section">
                <div className="reservation-container">
                    <div style={{
                        backgroundColor: reservaActual.estado?.toLowerCase() === 'activo' ? '#f8d7da' : 
                                         reservaActual.estado?.toLowerCase() === 'pendiente' ? '#fff3cd' : '#d1ecf1',
                        border: `2px solid ${reservaActual.estado?.toLowerCase() === 'activo' ? '#dc3545' : 
                                            reservaActual.estado?.toLowerCase() === 'pendiente' ? '#ffc107' : '#bee5eb'}`,
                        borderRadius: '12px',
                        padding: '25px',
                        marginBottom: '30px',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ 
                            color: reservaActual.estado?.toLowerCase() === 'activo' ? '#721c24' : 
                                   reservaActual.estado?.toLowerCase() === 'pendiente' ? '#856404' : '#0c5460',
                            marginBottom: '15px', 
                            fontSize: '1.5em' 
                        }}>
                            {reservaActual.estado?.toLowerCase() === 'activo' ? '🚫 No puedes realizar nuevas reservas' :
                             reservaActual.estado?.toLowerCase() === 'pendiente' ? '⏳ Tienes una reserva pendiente de aprobación' :
                             'ℹ️ Tienes una reserva en proceso'}
                        </h2>

                        <p style={{ 
                            color: reservaActual.estado?.toLowerCase() === 'activo' ? '#721c24' : 
                                  reservaActual.estado?.toLowerCase() === 'pendiente' ? '#856404' : '#0c5460',
                            fontSize: '1.1em', 
                            marginBottom: '15px' 
                        }}>
                            {reservaActual.estado?.toLowerCase() === 'pendiente' 
                                ? 'Tu reserva está en proceso de revisión. Una vez sea aprobada o rechazada, podrás realizar nuevas reservas.'
                                : mensajeBloqueo
                            }
                        </p>

                        <div style={{
                            backgroundColor: 'white',
                            padding: '15px',
                            borderRadius: '8px',
                            marginTop: '15px'
                        }}>
                            <h3 style={{ marginBottom: '10px' }}>
                                📋 Reserva {reservaActual.estado?.toLowerCase() === 'pendiente' ? 'Pendiente' : 'Actual'}:
                            </h3>
                            <p><strong>🏨 Habitación ID:</strong> {reservaActual.IDHabitacion}</p>
                            <p><strong>📅 Check-In:</strong> {formatearFecha(reservaActual.fechaIngreso)}</p>
                            <p><strong>📅 Check-Out:</strong> {formatearFecha(reservaActual.fechaEgreso)}</p>
                            <p><strong>💵 Precio:</strong> ${reservaActual.precio}</p>
                            <p><strong>
                                {reservaActual.estado?.toLowerCase() === 'pendiente' ? '⏳' : '✅'} Estado:
                            </strong> {reservaActual.estado}</p>
                        </div>

                        {reservaActual.estado?.toLowerCase() === 'pendiente' && (
                            <div style={{
                                marginTop: '15px',
                                padding: '10px',
                                backgroundColor: '#e2f0ff',
                                borderRadius: '6px',
                                fontSize: '0.9em'
                            }}>
                                <strong>💡 Información:</strong> Puedes contactar al administrador para conocer el estado de tu reserva.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        )}

        {/* SECCIÓN DE HABITACIONES */}
        <section className="reservation-rooms-section">
            <div className="reservation-container">
                <div className="reservation-rooms-grid">
                    {rooms.map((room) => {
                        const stats = obtenerEstadisticasOcupacion(room.id, reservasActivas, CAPACIDAD_TOTAL);

                        return (
                            <div key={room.id} className="reservation-room-card">
                                <div className="reservation-room-image">
                                    <img src={room.image} alt={`Habitación ${room.type}`} />
                                    <div className={`reservation-room-badge ${stats.disponiblesHoy === 0 ? 'no-available' : ''}`}>
                                        {stats.disponiblesHoy === 0 ? 'Lleno hoy' : `${stats.disponiblesHoy}/${CAPACIDAD_TOTAL} disponibles hoy`}
                                    </div>
                                </div>

                                <div className="reservation-room-content">
                                    <h3 className="reservation-room-type">{room.type}</h3>
                                    <p className="reservation-room-description">{room.description}</p>

                                    <ul className="reservation-room-features">
                                        {room.features.map((feature, index) => (
                                            <li key={index}>
                                                <span className="feature-icon">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {stats.ocupadasHoy > 0 && (
                                        <div style={{
                                            fontSize: '0.85em',
                                            color: '#666',
                                            marginTop: '10px',
                                            padding: '8px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px',
                                            textAlign: 'center'
                                        }}>
                                            📊 Ocupación hoy: {stats.porcentajeOcupacion}%
                                        </div>
                                    )}

                                    <button 
                                        className="reservation-btn"
                                        onClick={() => handleSeleccionar(room)}
                                        disabled={!puedeReservar || stats.disponiblesHoy === 0}
                                        style={{
                                            opacity: (puedeReservar && stats.disponiblesHoy > 0) ? 1 : 0.5,
                                            cursor: (puedeReservar && stats.disponiblesHoy > 0) ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        {stats.disponiblesHoy === 0 ? 'No Disponible' : 'Seleccionar Habitación'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>

        {/* FORMULARIO DE RESERVA */}
        {puedeReservar && selectedRoom && (
            <section ref={formRef} className="reservation-form-section visible">
                <div className="reservation-container">
                    <div className="reservation-form-container">
                        <h2 className="reservation-form-title">
                            Completa tu Reserva - Habitación {selectedRoom.type}
                        </h2>

                        <div className="alert alert-info" style={{ 
                            backgroundColor: fechasSugeridas.disponibles === 0 ? '#f8d7da' : '#d1ecf1',
                            borderColor: fechasSugeridas.disponibles === 0 ? '#f5c6cb' : '#bee5eb',
                            color: fechasSugeridas.disponibles === 0 ? '#721c24' : '#0c5460',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            border: '1px solid'
                        }}>
                            <strong>📅 Fechas sugeridas:</strong> Del {fechasSugeridas.checkIn} al {fechasSugeridas.checkOut}
                            <div style={{ marginTop: '8px', fontSize: '0.9em' }}>{fechasSugeridas.mensaje}</div>
                            <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
                                ✅ Disponibilidad: {fechasSugeridas.disponibles}/{CAPACIDAD_TOTAL} habitaciones libres
                            </div>
                        </div>

                        <form className="reservation-form" onSubmit={handleReserve}>
                            <div className="reservation-form-row">
                                <div className="reservation-form-group">
                                    <label>Fecha de Ingreso</label>
                                    <input 
                                        type="date" 
                                        name="checkIn"
                                        value={formData.checkIn}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required 
                                    />
                                </div>
                                <div className="reservation-form-group">
                                    <label>Fecha de Egreso</label>
                                    <input 
                                        type="date" 
                                        name="checkOut"
                                        value={formData.checkOut}
                                        onChange={handleInputChange}
                                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                        required 
                                    />
                                </div>
                            </div>
                            <button type="submit" className="reservation-submit-btn">
                                Confirmar Reserva
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        )}
    </div>
);
}
export default Reservation;
