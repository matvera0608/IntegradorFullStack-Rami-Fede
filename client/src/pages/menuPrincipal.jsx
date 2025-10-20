import '../styles/menuPrincipal.css';
import { useNavigate } from 'react-router-dom';
import  { React, useEffect, useState } from 'react';
import { obtenerHabitacionReservaActiva } from '../utils/ReserveActive';
import { useTokenCheck } from '../utils/useTokenCheck';
import { obtenerDetallesReservaActiva } from '../utils/ReserveActive';
import { validarPuedeReservar } from '../utils/ReserveActive';

const MenuPrincipal = () => {
  useTokenCheck();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tieneReservaActiva, setTieneReservaActiva] = useState(false);
  const [verificandoReserva, setVerificandoReserva] = useState(true);
  const [reservaActiva, setReservaActiva] = useState(null);

  const [puedeReservar, setPuedeReservar] = useState(true);
  const [mensajeBloqueo, setMensajeBloqueo] = useState('');
  const [reservaActual, setReservaActual] = useState(null);
  
  // Determinar el estado de la reserva para los estilos
  const getEstadoReserva = () => {
    if (!reservaActual) return 'sin-reserva';
    
    const estado = reservaActual.estado?.toLowerCase();
    if (estado === 'activo') return 'activo';
    if (estado === 'pendiente') return 'pendiente';
    if (estado === 'autorizado') return 'autorizado';
    return 'sin-reserva';
  };

  const estadoReserva = getEstadoReserva();

  useEffect(() => {    
    const verificarAutenticacionYReserva = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/api/reservations/sync', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error al sincronizar:', errorData);
        } else {
          const data = await response.json();
          console.log('Sincronización exitosa:', data);
        }

        const resultadoReserva = await obtenerHabitacionReservaActiva(token);
        setTieneReservaActiva(resultadoReserva.tieneReservaActiva);

      } catch (error) {
        console.error('Error en la llamada al backend:', error);
        setTieneReservaActiva(false);
      }
      finally {
        setVerificandoReserva(false);
        setLoading(false);
      }
    };
    verificarAutenticacionYReserva();
  }, [navigate]);

  const handleReservar = () => {
    navigate('/reservations');
  };

  const handleVerReserva = () => {
    navigate('/mybooking');
  };

  useEffect(() => {
    const cargarDetallesReserva = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const validacion = await validarPuedeReservar(token);
        setPuedeReservar(validacion.puedeReservar);
        setMensajeBloqueo(validacion.motivo);
        setReservaActual(validacion.reservaActual);
        
        const resultado = await obtenerDetallesReservaActiva(token);
        setReservaActiva(resultado.reserva);
      } catch (error) {
        console.error('Error al cargar detalles de la reserva activa:', error);
      }
    };

    cargarDetallesReserva();
  }, []);

  const handlePedido = () => {
    // Solo permitir pedidos si la reserva está activa o autorizada
    const puedePedir = estadoReserva === 'activo' || estadoReserva === 'autorizado';
    
    if (!puedePedir) {
      alert('Solo puedes pedir buffet si tienes una reserva activa o autorizada para hoy');
      return;
    }
    navigate('/buffet');
  };

  // Función para obtener las clases CSS según el estado
  const getCardClasses = () => {
    switch(estadoReserva) {
      case 'activo':
        return "menu-card-success";
      case 'pendiente':
        return "menu-card-warning";
      case 'autorizado':
        return "menu-card-info";
      default:
        return "menu-card-primary";
    }
  };

  const getIconClasses = () => {
    switch(estadoReserva) {
      case 'activo':
        return "menu-success-icon";
      case 'pendiente':
        return "menu-warning-icon";
      case 'autorizado':
        return "menu-info-icon";
      default:
        return "menu-primary-icon";
    }
  };

  const getButtonClasses = () => {
    switch(estadoReserva) {
      case 'activo':
        return "menu-btn-success";
      case 'pendiente':
        return "menu-btn-warning";
      case 'autorizado':
        return "menu-btn-info";
      default:
        return "menu-btn-primary";
    }
  };

  const getButtonIcon = () => {
    switch(estadoReserva) {
      case 'activo':
        return "fa-door-open";
      case 'pendiente':
        return "fa-clock";
      case 'autorizado':
        return "fa-check-circle";
      default:
        return "fa-calendar-plus";
    }
  };

  const getButtonText = () => {
    switch(estadoReserva) {
      case 'activo':
        return "Ver mi Reserva";
      case 'pendiente':
        return "Ver Reserva Pendiente";
      case 'autorizado':
        return "Ver Reserva Confirmada";
      default:
        return "Reservar Ahora";
    }
  };

  const getCardTitle = () => {
    switch(estadoReserva) {
      case 'activo':
        return "Ver mi Reserva";
      case 'pendiente':
        return "Reserva Pendiente";
      case 'autorizado':
        return "Reserva Confirmada";
      default:
        return "Reservar Habitación";
    }
  };

  const getCardDescription = () => {
    switch(estadoReserva) {
      case 'activo':
        return "Consulta los detalles de tu estadía actual";
      case 'pendiente':
        return "Tu reserva está en proceso de revisión y aprobación";
      case 'autorizado':
        return "Tu reserva ha sido confirmada - Prepárate para tu estadía";
      default:
        return "Encuentra la habitación perfecta para tu estadía";
    }
  };

  if (loading || verificandoReserva) {
    return (
      <div className="menu-container">
        <div className="menu-loading">
          <p>Verificando disponibilidad...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="menu-container">
        <section className="menu-welcome-section">
          <h2>¡Bienvenido de vuelta!</h2>
          <p>Gestiona tus reservas y pedidos desde tu panel personal</p>
        </section>

        <section className="menu-quick-actions">
          <h3>Acciones Rápidas</h3>
          <div className="menu-row menu-justify-content-center">
            
            {/* CARD PRINCIPAL - CAMBIA SEGÚN ESTADO */}
            <div className="menu-col-md-5">
              <div
                className={`menu-card menu-action-card menu-h-100 menu-border-0 menu-shadow ${getCardClasses()}`}
              >
                <div className="menu-card-body menu-text-center">
                  <div
                    className={`menu-action-icon menu-mx-auto menu-mb-3 ${getIconClasses()}`}
                  >
                    <i className={`fas ${getButtonIcon()}`}></i>
                  </div>

                  <h4 className="menu-card-title">
                    {getCardTitle()}
                  </h4>

                  <p className="menu-card-text">
                    {getCardDescription()}
                  </p>

                  <button
                    className={`menu-btn menu-btn-lg ${getButtonClasses()}`}
                    onClick={() =>
                      estadoReserva !== 'sin-reserva' ? handleVerReserva() : handleReservar()
                    }
                  >
                    <i
                      className={`fas ${getButtonIcon()} menu-me-2`}
                    ></i>
                    {getButtonText()}
                  </button>

                  {/* Mensaje informativo adicional para estado pendiente */}
                  {estadoReserva === 'pendiente' && (
                    <div className="menu-alert menu-mt-3">
                      <small className="menu-text-muted">
                        <i className="fas fa-info-circle menu-me-1"></i>
                        Tu reserva está siendo revisada. Te notificaremos cuando sea aprobada.
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
<div className="menu-col-md-5">
              <div className="menu-card menu-action-card menu-h-100 menu-border-0 menu-shadow">
                <div className="menu-card-body menu-text-center">
                  <div className="menu-action-icon menu-secondary-icon menu-mx-auto menu-mb-3">
                    <i className="fas fa-utensils"></i>
                  </div>
                 <h4 className="menu-card-title">Pedir Buffet</h4>
                  <p className="menu-card-text">
                    {tieneReservaActiva 
                      ? "Disfruta de nuestro delicioso buffet en tu habitación"
                      : "Necesitas una reserva activa para hoy para realizar pedidos"
                    }
                  </p>
                  <button 
                    className={`menu-btn menu-btn-lg ${
                      tieneReservaActiva 
                        ? "menu-btn-outline-warning" 
                        : "menu-btn-secondary menu-disabled"
                    }`}
                    id="menu-buffet-btn"
                    onClick={handlePedido}
                    disabled={!tieneReservaActiva}
                  >
                    <i className={`fas ${
                      tieneReservaActiva ? "fa-shopping-cart" : "fa-ban"
                    } menu-me-2`}></i>
                    {tieneReservaActiva ? "Pedir Buffet" : "No Disponible"}
                  </button>
                  
                  {/* Mensaje informativo cuando no hay reserva */}
                  {!tieneReservaActiva && (
                    <div className="menu-alert menu-mt-3">
                      <small className="menu-text-muted">
                        <i className="fas fa-info-circle menu-me-1"></i>
                        Solo disponible para huéspedes con reserva activa hoy
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="menu-dashboard-grid">
          <div className="menu-dashboard-card">
            <div className="menu-card-header">
              <h3>
                <i className="fas fa-calendar-check menu-me-2"></i>Próximas Reservas
              </h3>
              <a href="/mybooking" className="menu-view-all">Ver todas</a>
            </div>
            
            <div className="menu-card-content">
              <div className="menu-reservation-item menu-active">
                <div className="menu-reservation-info">
                  <h4>Habitación Deluxe #205</h4>
                  <p>25 - 28 Agosto 2025</p>
                  <p>2 huéspedes</p>
                </div>
                <div className="menu-reservation-status">
                  <span className="menu-status-badge menu-confirmed">Confirmada</span>
                </div>
              </div>
              
              <div className="menu-reservation-item">
                <div className="menu-reservation-info">
                  <h4>Habitación Suite #301</h4>
                  <p>15 - 17 Septiembre 2025</p>
                  <p>2 huéspedes</p>
                </div>
                <div className="menu-reservation-status">
                  <span className="menu-status-badge menu-pending">Pendiente</span>
                </div>
              </div>
            </div>
          </div>

          <div className="menu-dashboard-card">
            <div className="menu-card-header">
              <h3>
                <i className="fas fa-clipboard-list menu-me-2"></i>Últimos Pedidos
              </h3>
              <a href="/myOrders" className="menu-view-all">Ver historial</a>
            </div>
            
            <div className="menu-card-content">
              <div className="menu-order-item">
                <div className="menu-order-info">
                  <h4>Desayuno Continental</h4>
                  <p>Habitación #205</p>
                  <p className="menu-order-date">22 Agosto 2025 - 08:30</p>
                </div>
                <div className="menu-order-status">
                  <span className="menu-status-badge menu-delivered">Entregado</span>
                </div>
              </div>
              
              <div className="menu-order-item">
                <div className="menu-order-info">
                  <h4>Menú especial</h4>
                  <p>Habitación #205</p>
                  <p className="menu-order-date">21 Agosto 2025 - 19:00</p>
                </div>
                <div className="menu-order-status">
                  <span className="menu-status-badge menu-delivered">Entregado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="menu-dashboard-card menu-stats-card">
            <div className="menu-card-header">
              <h3>
                <i className="fas fa-chart-bar menu-me-2"></i>Resumen
              </h3>
            </div>
            <div className="menu-card-content">
              <div className="menu-stats-grid">
                <div className="menu-stat-item">
                  <div className="menu-stat-number">3</div>
                  <div className="menu-stat-label">Reservas Totales</div>
                </div>
                <div className="menu-stat-item">
                  <div className="menu-stat-number">8</div>
                  <div className="menu-stat-label">Pedidos Realizados</div>
                </div>
                <div className="menu-stat-item">
                  <div className="menu-stat-number">1</div>
                  <div className="menu-stat-label">Reserva Activa</div>
                </div>
                <div className="menu-stat-item">
                  <div className="menu-stat-number">★ 4.9</div>
                  <div className="menu-stat-label">Tu Calificación</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer id="menu-contacto" className="menu-contact-footer">
        <div className="menu-container">
          <div className="menu-row">
            <div className="menu-col-12 menu-text-center menu-mb-4">
              <h2 className="menu-section-title menu-text-white">Contáctanos</h2>
              <p className="menu-section-subtitle menu-text-white-50">Estamos aquí para hacer realidad tu estadía perfecta</p>
            </div>
          </div>
          
          <div className="menu-row menu-justify-content-center">
            <div className="menu-col-lg-8 menu-col-md-10">
              <div className="menu-contact-info">
                <div className="menu-contact-item">
                  <div className="menu-contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="menu-contact-details">
                    <h5>Dirección</h5>
                    <p>Avenida Paraíso 123 — Playa Dorada, Costa Tropical — CP 12345</p>
                  </div>
                </div>
                
                <div className="menu-contact-item">
                  <div className="menu-contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="menu-contact-details">
                    <h5>Teléfono</h5>
                    <p>+1 (555) 123-4567 &nbsp; | &nbsp; +1 (555) 765-4321</p>
                  </div>
                </div>
                
                <div className="menu-contact-item">
                  <div className="menu-contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="menu-contact-details">
                    <h5>Email</h5>
                    <p>info@hotelparadise.com &nbsp; | &nbsp; reservas@hotelparadise.com</p>
                  </div>
                </div>
                
                <div className="menu-contact-item">
                  <div className="menu-contact-icon">
                    <i className="fas fa-share-alt"></i>
                  </div>
                  <div className="menu-contact-details">
                    <h5>Síguenos</h5>
                    <div className="menu-social-links">
                      <a href="#"><i className="fab fa-facebook"></i></a>
                      <a href="#"><i className="fab fa-instagram"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                      <a href="#"><i className="fab fa-youtube"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="menu-row">
            <div className="menu-col-12 menu-text-center menu-copyright">
              <small className="menu-text-white-50">&copy; 2025 Hotel Paradise. Todos los derechos reservados.</small>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default MenuPrincipal;