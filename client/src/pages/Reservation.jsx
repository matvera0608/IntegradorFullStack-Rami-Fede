import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Reservation.css';
import { useRooms } from '../hooks/useRooms';
import { useAuth } from '../hooks/useAuth';
import { 
    validarCapacidad, 
    calcularFechasSugeridaConCapacidad,
    obtenerEstadisticasOcupacion 
} from '../utils/reservationUtils';

// Constante: Capacidad total de habitaciones por tipo
const CAPACIDAD_TOTAL = 10;

// Función para decodificar el token 
const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload;
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};

const Reservation = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    if (!token) {
        navigate('/login');
    }

    const { rooms, loading, error, reservasActivas } = useRooms();
    const { user, loading: authLoading } = useAuth();

    const [selectedRoom, setSelectedRoom] = useState(null);
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

    // Función para manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSeleccionar = (room) => {
        console.log('═══════════════════════════════════════════');
        console.log(`🏨 Seleccionando habitación: ${room.type} (ID: ${room.id})`);
        console.log('═══════════════════════════════════════════');
        
        setSelectedRoom(room);
        
        // Calcular fechas sugeridas considerando capacidad
        const fechas = calcularFechasSugeridaConCapacidad(
            room.id, 
            reservasActivas, 
            CAPACIDAD_TOTAL
        );
        
        console.log('📅 Fechas sugeridas calculadas:', fechas);
        
        // Obtener estadísticas de ocupación
        const stats = obtenerEstadisticasOcupacion(room.id, reservasActivas, CAPACIDAD_TOTAL);
        console.log('📊 Estadísticas de ocupación:', stats);
        
        setFechasSugeridas(fechas);
        
        // Pre-rellenar fechas sugeridas
        setFormData(prev => ({
            ...prev,
            checkIn: fechas.checkIn,
            checkOut: fechas.checkOut,
            phone: '',
            guests: '',
            comments: ''
        }));

        // Scroll suave hacia el formulario
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
    };

    // Función para aplicar fechas sugeridas manualmente
    const aplicarFechasSugeridas = () => {
        setFormData(prev => ({
            ...prev,
            checkIn: fechasSugeridas.checkIn,
            checkOut: fechasSugeridas.checkOut
        }));
    };

    const handleReserve = async (e) => {
        e.preventDefault();

        console.log('═══════════════════════════════════════════');
        console.log('🔄 Iniciando proceso de reserva');
        console.log('═══════════════════════════════════════════');

        // Validar fechas básicas
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

        // ✅ VALIDACIÓN CON CAPACIDAD
        const validacion = validarCapacidad(
            selectedRoom.id,
            formData.checkIn, 
            formData.checkOut, 
            reservasActivas,
            CAPACIDAD_TOTAL
        );

        console.log('🔍 Resultado de validación de capacidad:', validacion);

        if (!validacion.disponible) {
            alert(
                `❌ No hay disponibilidad en las fechas seleccionadas.\n\n` +
                `📊 Ocupación: ${validacion.ocupadas}/${CAPACIDAD_TOTAL} habitaciones reservadas\n\n` +
                `💡 Te sugerimos usar:\n` +
                `📅 Check-In: ${fechasSugeridas.checkIn}\n` +
                `📅 Check-Out: ${fechasSugeridas.checkOut}\n` +
                `✅ Disponibles: ${fechasSugeridas.disponibles}/${CAPACIDAD_TOTAL} habitaciones`
            );
            return;
        }

        // Mostrar confirmación con disponibilidad
        const confirmacion = window.confirm(
            `¿Confirmar reserva?\n\n` +
            `🏨 Habitación: ${selectedRoom.type}\n` +
            `📅 Check-In: ${formData.checkIn}\n` +
            `📅 Check-Out: ${formData.checkOut}\n` +
            `✅ Disponibilidad: ${validacion.disponibles}/${CAPACIDAD_TOTAL} habitaciones libres`
        );

        if (!confirmacion) return;

        try {
            const decodedToken = decodeToken(token);
            console.log('🔑 Token decodificado:', decodedToken);

            // Extraer precio de las features
            const priceFeature = selectedRoom.features.find(feature => 
                feature.toLowerCase().includes('precio')
            );
            const precio = priceFeature ? parseInt(priceFeature.match(/\d+/)[0]) : 0;

            // Estructura de datos según tu tabla 'reservas'
            const reservationData = {
                fechaIngreso: formData.checkIn,
                fechaEgreso: formData.checkOut,
                estado: 'activo',
                precio: precio,
                IDHabitacion: selectedRoom.id,
                IDUsuario: decodedToken.IDUsuario || decodedToken.id
            };

            console.log('📤 Enviando reserva al backend:', reservationData);

            const response = await fetch('http://localhost:8080/api/reservations/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservationData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
            }

            console.log('✅ Reserva creada exitosamente:', result);
            alert('¡Reserva creada exitosamente! 🎉');
            
            // Recargar para actualizar disponibilidad
            window.location.reload();

        } catch (error) {
            console.error('❌ Error al crear reserva:', error);
            alert('Error al crear la reserva: ' + error.message);
        }
    };

    // Mostrar estados de carga
    if (loading || authLoading) {
        return (
            <div className="reservation-page">
                <div className="reservation-container">
                    <div className="reservation-loading">
                        <h2>Cargando habitaciones...</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reservation-page">
                <div className="reservation-container">
                    <div className="reservation-error">
                        <h2>Error: {error}</h2>
                        <p>No se pudieron cargar las habitaciones</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reservation-page">
            <section className="reservation-hero">
                <div className="reservation-container">
                    <h1 className="reservation-title">Reserva tu Habitación</h1>
                    <p className="reservation-subtitle">Elige la habitación perfecta para tu estadía</p>
                </div>
            </section>

            <section className="reservation-rooms-section">
                <div className="reservation-container">
                    <div className="reservation-rooms-grid">
                        {rooms.map((room) => {
                            // Calcular ocupación actual para mostrar en la tarjeta
                            const stats = obtenerEstadisticasOcupacion(room.id, reservasActivas, CAPACIDAD_TOTAL);
                            
                            return (
                                <div key={room.id} className="reservation-room-card">
                                    <div className="reservation-room-image">
                                        <img src={room.image} alt={`Habitación ${room.type}`} />
                                        <div className={`reservation-room-badge ${stats.disponiblesHoy === 0 ? 'no-available' : ''}`}>
                                            {stats.disponiblesHoy === 0 
                                                ? 'Lleno hoy' 
                                                : `${stats.disponiblesHoy}/${CAPACIDAD_TOTAL} disponibles hoy`
                                            }
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
                                        
                                        {/* Mostrar ocupación actual */}
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
                                        >
                                            Seleccionar Habitación
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FORMULARIO DE RESERVA */}
            <section 
                ref={formRef}
                className={`reservation-form-section ${selectedRoom ? 'visible' : 'hidden'}`}
            >
                <div className="reservation-container">
                    {selectedRoom && (
                        <div className="reservation-form-container">
                            <h2 className="reservation-form-title">
                                Completa tu Reserva - Habitación {selectedRoom.type}
                            </h2>
                            
                            {/* Alerta informativa con disponibilidad */}
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
                                <div style={{ marginTop: '8px', fontSize: '0.9em' }}>
                                    {fechasSugeridas.mensaje}
                                </div>
                                <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
                                    ✅ Disponibilidad: {fechasSugeridas.disponibles}/{CAPACIDAD_TOTAL} habitaciones libres
                                </div>
                            </div>
                            
                            <form className="reservation-form" onSubmit={handleReserve}>
                                <div className="reservation-form-row">
                                    <div className="reservation-form-group">
                                        <label className="reservation-form-label">Fecha de Ingreso</label>
                                        <input 
                                            type="date" 
                                            name="checkIn"
                                            value={formData.checkIn}
                                            onChange={handleInputChange}
                                            className="reservation-form-input"
                                            min={new Date().toISOString().split('T')[0]}
                                            required 
                                        />
                                    </div>
                                    <div className="reservation-form-group">
                                        <label className="reservation-form-label">Fecha de Egreso</label>
                                        <input 
                                            type="date" 
                                            name="checkOut"
                                            value={formData.checkOut}
                                            onChange={handleInputChange}
                                            className="reservation-form-input"
                                            min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="reservation-form-row">
                                    <div className="reservation-form-group">
                                        <label className="reservation-form-label">Teléfono</label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="reservation-form-input"
                                            placeholder="+54 9 11 1234-5678"
                                            required 
                                        />
                                    </div>
                                    <div className="reservation-form-group">
                                        <label className="reservation-form-label">Número de Huéspedes</label>
                                        <select 
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleInputChange}
                                            className="reservation-form-input" 
                                            required
                                        >
                                            <option value="">Selecciona...</option>
                                            <option value="1">1 Huésped</option>
                                            <option value="2">2 Huéspedes</option>
                                            <option value="3">3 Huéspedes</option>
                                            <option value="4">4 Huéspedes</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="reservation-form-group">
                                    <label className="reservation-form-label">Comentarios Adicionales</label>
                                    <textarea 
                                        name="comments"
                                        value={formData.comments}
                                        onChange={handleInputChange}
                                        className="reservation-form-textarea"
                                        placeholder="Solicitudes especiales, requerimientos, alergias, etc..."
                                        rows="4"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="reservation-submit-btn"
                                >
                                    Confirmar Reserva
                                </button>
                                
                                {/* Botón para re-aplicar fechas sugeridas */}
                                <button 
                                    type="button"
                                    className="reservation-suggested-dates-btn"
                                    onClick={aplicarFechasSugeridas}
                                    style={{ 
                                        marginTop: '10px',
                                        backgroundColor: '#17a2b8',
                                        color: 'white',
                                        padding: '12px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        width: '100%',
                                        fontWeight: '500'
                                    }}
                                >
                                    🔄 Restaurar Fechas Sugeridas ({fechasSugeridas.checkIn} - {fechasSugeridas.checkOut}) 
                                    [{fechasSugeridas.disponibles}/{CAPACIDAD_TOTAL} disponibles]
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Reservation;