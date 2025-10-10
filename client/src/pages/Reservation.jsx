import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Reservation.css';
import useRooms from '../hooks/useRooms';
import { useAuth } from '../hooks/useAuth'; 

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
    const { rooms, loading, error } = useRooms();
    const { user, loading: authLoading } = useAuth(); // Hook de autenticación

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        phone: '',
        guests: '',
        comments: ''
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
        console.log(`Reservando habitación: ${room.type}`);
        setSelectedRoom(room);
        // Resetear el formulario cuando se selecciona una nueva habitación
        setFormData({
            checkIn: '',
            checkOut: '',
            phone: '',
            guests: '',
            comments: ''
        });
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
    };
const handleReserve = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes estar autenticado para hacer una reserva');
        return;
    }

    try {
        const decodedToken = decodeToken(token);
        console.log('Token decodificado:', decodedToken);

        const priceFeature = selectedRoom.features.find(feature => feature.includes('Precio'));
        const precio = priceFeature ? parseInt(priceFeature.match(/\d+/)[0]) : 0;

        const reservationData = {
            fechaIngreso: formData.checkIn,
            fechaEgreso: formData.checkOut,
            estado: 'activo',
            IDUsuario: decodedToken.IDUsuario || decodedToken.id, 
            IDHabitacion: selectedRoom.id,
            precio: precio
        };

        console.log('Enviando reserva:', reservationData);

        const response = await fetch('http://localhost:8080/api/reservations/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reservationData)
        });

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        if (!response.ok) {
            throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
        }

        alert('Reserva creada exitosamente');
        
        setFormData({
            checkIn: '',
            checkOut: '',
            phone: '',
            guests: '',
            comments: ''
        });
        setSelectedRoom(null);

    } catch (error) {
        console.error('Error completo:', error);
        alert('Error al crear la reserva: ' + error.message);
    }
};

    // Mostrar estados de carga
    if (loading || authLoading) {
        return (
            <div className="reservation-page">
                <div className="reservation-container">
                    <div className="reservation-loading">
                        <h2>Cargando...</h2>
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
                        {rooms.map((room) => (
                            <div key={room.id} className="reservation-room-card">
                                <div className="reservation-room-image">
                                    <img src={room.image} alt={`Habitación ${room.type}`} />
                                    <div className="reservation-room-badge">
                                        {room.available} disponibles
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
                                    
                                    <button 
                                        className="reservation-btn"
                                        onClick={() => handleSeleccionar(room)}
                                    >
                                        Seleccionar Habitación
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECCIÓN DEL FORMULARIO */}
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
                                            placeholder="+1 (555) 123-4567"
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
                                        placeholder="Comentarios especiales, requerimientos, etc..."
                                        rows="4"
                                    />
                                </div>

                                <button type="submit" className="reservation-submit-btn">
                                    Confirmar Reserva
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