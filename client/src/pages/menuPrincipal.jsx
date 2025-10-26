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
  
  // 🔹 Estados para datos dinámicos
  const [ultimasReservas, setUltimasReservas] = useState([]);
  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalReservas: 0,
    totalPedidos: 0,
    reservasActivas: 0
  });
  
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

  // 🔹 Cargar últimas 2 reservas y últimos 2 pedidos
  useEffect(() => {
    const cargarReservasYPedidos = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Obtener userId del token decodificado
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.userId || tokenPayload.sub || tokenPayload.id;

        console.log('🔍 UserID extraído:', userId);

        // 🔹 1. Obtener las reservas del usuario
        const responseReservas = await fetch(`http://localhost:8080/api/reservations/booking/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (responseReservas.ok) {
          const reservasData = await responseReservas.json();
          console.log('📋 Reservas recibidas:', reservasData);
          
            // 🔹 Procesar reservas y obtener tipo de habitación
            const reservasConTipo = await Promise.all(
              reservasData.map(async (reserva) => {
                try {
                  console.log(reserva.IDHabitacion);
                  const responseTipo = await fetch(`http://localhost:8080/api/room/type/${reserva.IDHabitacion}`);
                  if (responseTipo.ok) {
                    const tipoData = await responseTipo.json();
                    return {
                      ...reserva,
                      tipoHabitacion: tipoData.type  // fallback si no viene type
                    };
                  } else {
                    console.warn(`No se encontró tipo para habitación ${reserva.IDHabitacion} (status ${responseTipo.status})`);
                  }
                } catch (error) {
                  console.error(`Error al obtener tipo de habitación ${reserva.IDHabitacion}:`, error);
                }

                // Siempre retornar la reserva, aunque haya error
                return {
                  ...reserva,
                  tipoHabitacion: 'Standard'
                };
              })
            );


          // Ordenar por fecha de ingreso más reciente y tomar las últimas 2
          const reservasOrdenadas = reservasConTipo
            .sort((a, b) => {
              const fechaA = new Date(a.fechaIngreso);
              const fechaB = new Date(b.fechaIngreso);
              return fechaB - fechaA;
            })
            .slice(0, 2);
          
          setUltimasReservas(reservasOrdenadas);
          
          // Actualizar estadísticas de reservas
          const reservasActivas = reservasData.filter(r => 
            r.estado?.toLowerCase() === 'activo'
          ).length;
          
          setEstadisticas(prev => ({
            ...prev,
            totalReservas: reservasData.length,
            reservasActivas: reservasActivas
          }));
        } else {
          console.error('❌ Error al obtener reservas:', responseReservas.status);
        }

        // 🔹 2. Obtener los pedidos del usuario
        const responsePedidos = await fetch('http://localhost:8080/api/orders/order', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (responsePedidos.ok) {
          const pedidosData = await responsePedidos.json();
          console.log('🍽️ Pedidos recibidos:', pedidosData);
          
          // Ordenar por fecha de pedido más reciente y tomar los últimos 2
          const pedidosOrdenados = pedidosData
            .sort((a, b) => {
              const fechaA = new Date(a.fechaPedido);
              const fechaB = new Date(b.fechaPedido);
              return fechaB - fechaA;
            })
            .slice(0, 2);
          
          setUltimosPedidos(pedidosOrdenados);
          
          // Actualizar estadísticas de pedidos
          setEstadisticas(prev => ({
            ...prev,
            totalPedidos: pedidosData.length
          }));
        } else {
          console.error('❌ Error al obtener pedidos:', responsePedidos.status);
        }

      } catch (error) {
        console.error('❌ Error al cargar reservas y pedidos:', error);
      }
    };

    cargarReservasYPedidos();
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

  // 🔹 Función para obtener el texto del estado de la reserva en español
  const getEstadoTexto = (estado) => {
    const estadosMap = {
      'activo': 'Activa',
      'pendiente': 'Pendiente',
      'autorizado': 'Autorizada',
      'cancelado': 'Cancelada',
      'finalizado': 'Finalizada'
    };
    return estadosMap[estado?.toLowerCase()] || estado || 'Confirmada';
  };

  // 🔹 Función para obtener el texto del estado del pedido en español
  const getEstadoPedidoTexto = (estado) => {
    const estadosMap = {
      'pendiente': 'Pendiente',
      'en preparación': 'En Preparación',
      'en camino': 'En Camino',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return estadosMap[estado?.toLowerCase()] || estado || 'Entregado';
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

        {/* 🔹 SECCIÓN CON DATOS DINÁMICOS */}
        <section className="menu-dashboard-grid">
          {/* 🔹 ÚLTIMAS RESERVAS - DATOS DINÁMICOS */}
          <div className="menu-dashboard-card">
            <div className="menu-card-header">
              <h3>
                <i className="fas fa-calendar-check menu-me-2"></i>Próximas Reservas
              </h3>
              <a href="/mybooking" className="menu-view-all">Ver todas</a>
            </div>
            
            <div className="menu-card-content">
              {ultimasReservas.length > 0 ? (
                ultimasReservas.map((reserva, index) => {
                  return (
                    <div key={reserva.IDReserva || index} className={`menu-reservation-item ${index === 0 ? 'menu-active' : ''}`}>
                      <div className="menu-reservation-info">
                        <h4>Habitación {reserva.tipoHabitacion || 'Standard'} #{reserva.IDHabitacion}</h4>
                        <p>
                          {new Date(reserva.fechaIngreso).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long' 
                          })} - {' '}
                          {new Date(reserva.fechaEgreso).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                        <p>Precio: ${reserva.precio}</p>
                      </div>
                      <div className="menu-reservation-status">
                        <span className={`menu-status-badge ${
                          reserva.estado?.toLowerCase() === 'activo' || reserva.estado?.toLowerCase() === 'autorizado'
                            ? 'menu-confirmed' 
                            : reserva.estado?.toLowerCase() === 'pendiente' 
                            ? 'menu-pending'
                            : 'menu-confirmed'
                        }`}>
                          {getEstadoTexto(reserva.estado)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="menu-reservation-item">
                  <div className="menu-reservation-info">
                    <p className="menu-text-muted">
                      <i className="fas fa-calendar-times menu-me-2"></i>
                      No tienes reservas recientes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🔹 ÚLTIMOS PEDIDOS - DATOS DINÁMICOS */}
          <div className="menu-dashboard-card">
            <div className="menu-card-header">
              <h3>
                <i className="fas fa-clipboard-list menu-me-2"></i>Últimos Pedidos
              </h3>
              <a href="/myOrders" className="menu-view-all">Ver historial</a>
            </div>
            
            <div className="menu-card-content">
              {ultimosPedidos.length > 0 ? (
                ultimosPedidos.map((pedido, index) => {
                  // Obtener el nombre y descripción del producto desde detalles[0].producto
                  const nombreProducto = pedido.detalles?.[0]?.producto?.nombre || 'Pedido de Buffet';
                  const descripcionProducto = pedido.detalles?.[0]?.producto?.descripcion || '';
                  const cantidad = pedido.detalles?.[0]?.cantidad || 1;
                  
                  return (
                    <div key={pedido.ID || index} className="menu-order-item">
                      <div className="menu-order-info">
                        <h4>{nombreProducto}</h4>
                        <p>{descripcionProducto}</p>
                        <p>Habitación #{pedido.IDHabitacion}</p>
                        <p className="menu-order-date">
                          {new Date(pedido.fechaPedido).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })} - {new Date(pedido.fechaPedido).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="menu-order-status">
                        <span className={`menu-status-badge ${
                          pedido.estado?.toLowerCase() === 'entregado'
                            ? 'menu-delivered'
                            : pedido.estado?.toLowerCase() === 'pendiente'
                            ? 'menu-pending'
                            : pedido.estado?.toLowerCase() === 'en preparación'
                            ? 'menu-pending'
                            : pedido.estado?.toLowerCase() === 'en camino'
                            ? 'menu-pending'
                            : 'menu-delivered'
                        }`}>
                          {getEstadoPedidoTexto(pedido.estado)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="menu-order-item">
                  <div className="menu-order-info">
                    <p className="menu-text-muted">
                      <i className="fas fa-shopping-basket menu-me-2"></i>
                      No tienes pedidos recientes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🔹 ESTADÍSTICAS - DATOS DINÁMICOS */}
          <div className="menu-dashboard-card menu-stats-card">
            <div className="menu-card-header">
              <h3>
                <i className="fas fa-chart-bar menu-me-2"></i>Resumen
              </h3>
            </div>
            <div className="menu-card-content">
              <div className="menu-stats-grid">
                <div className="menu-stat-item">
                  <div className="menu-stat-number">{estadisticas.totalReservas}</div>
                  <div className="menu-stat-label">Reservas Totales</div>
                </div>
                <div className="menu-stat-item">
                  <div className="menu-stat-number">{estadisticas.totalPedidos}</div>
                  <div className="menu-stat-label">Pedidos Realizados</div>
                </div>
                <div className="menu-stat-item">
                  <div className="menu-stat-number">{estadisticas.reservasActivas}</div>
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