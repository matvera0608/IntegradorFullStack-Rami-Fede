import { useState, useMemo, useEffect } from 'react';
import '../styles/reservationMagnament.css';

export default function MyBooking() {
  const [reservas, setReservas] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [filtroTemporal, setFiltroTemporal] = useState('actuales');
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reservasPorPagina = 10;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

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

  // Cargar reservas del usuario
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No se encontró token de autenticación');
          setLoading(false);
          return;
        }

        const decodedToken = decodeToken(token);
        const userId = decodedToken?.IDUsuario || decodedToken?.id;

        const response = await fetch(`http://localhost:8080/api/reservations/booking/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las reservas');
        }

        const data = await response.json();
        setReservas(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar reservas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const reservasFiltradas = useMemo(() => {
    let filtradas = [];
    
    if (filtroTemporal === 'actuales') {
      // Mostrar reservas pendientes y activas
      filtradas = reservas.filter(r => 
        r.estado === 'pendiente' || r.estado === 'activo'
      );
    } else if (filtroTemporal === 'pasadas') {
      // Mostrar reservas finalizadas
      filtradas = reservas.filter(r => r.estado === 'finalizado');
    }

    return filtradas.sort((a, b) => 
      new Date(a.fechaIngreso) - new Date(b.fechaIngreso)
    );
  }, [reservas, filtroTemporal]);

  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
  const indiceInicio = (paginaActual - 1) * reservasPorPagina;
  const indiceFin = indiceInicio + reservasPorPagina;
  const reservasPaginadas = reservasFiltradas.slice(indiceInicio, indiceFin);

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8080/api/reservations/booking/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la reserva');
      }

      // Actualizar el estado local
      setReservas(reservas.map(r => 
        r.IDReserva === id ? { ...r, estado: nuevoEstado } : r
      ));
      setSelectedReserva(null);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al actualizar la reserva');
    }
  };

  const handleFiltroChange = (nuevoFiltro) => {
    setFiltroTemporal(nuevoFiltro);
    setPaginaActual(1);
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const getDiasRestantes = (fechaIngreso) => {
    const fecha = new Date(fechaIngreso);
    fecha.setHours(0, 0, 0, 0);
    const dias = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
    return dias;
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'pendiente': { text: 'Pendiente', class: 'badge-warning' },
      'activo': { text: 'Activa', class: 'badge-success' },
      'finalizado': { text: 'Finalizada', class: 'badge-secondary' },
      'cancelado': { text: 'Cancelada', class: 'badge-danger' }
    };
    return badges[estado] || { text: estado, class: 'badge-default' };
  };

  if (loading) {
    return (
      <div className="reservas-container">
        <div className="reservas-wrapper">
          <p className="loading-text">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservas-container">
        <div className="reservas-wrapper">
          <div className="error-container">
            <p className="error-text">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservas-container">
      <div className="reservas-wrapper">
        <div className="reservas-header">
          <h1 className="reservas-title">Gestión de Reservas</h1>
          <p className="reservas-subtitle">Administra tus reservas</p>
        </div>

        {/* Filtros temporales */}
        <div className="filtros-container">
          <div className="filtros-buttons">
            <button
              onClick={() => handleFiltroChange('actuales')}
              className={`filtro-btn ${filtroTemporal === 'actuales' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Mis Reservas
              <span className="filtro-count">
                ({reservas.filter(r => r.estado === 'pendiente' || r.estado === 'activo').length})
              </span>
            </button>
            
            <button
              onClick={() => handleFiltroChange('pasadas')}
              className={`filtro-btn ${filtroTemporal === 'pasadas' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Reservas Pasadas
              <span className="filtro-count">
                ({reservas.filter(r => r.estado === 'finalizado').length})
              </span>
            </button>
          </div>
        </div>

        {/* Lista de reservas */}
        {reservasPaginadas.length === 0 ? (
          <div className="sin-resultados">
            <p className="sin-resultados-text">
              {filtroTemporal === 'actuales' 
                ? 'No tienes reservas activas o pendientes' 
                : 'No tienes reservas pasadas'}
            </p>
          </div>
        ) : (
          <div className="reservas-lista">
            {reservasPaginadas.map((reserva) => {
              const diasRestantes = getDiasRestantes(reserva.fechaIngreso);
              const estadoBadge = getEstadoBadge(reserva.estado);
              const esPendiente = reserva.estado === 'pendiente';
              const esActiva = reserva.estado === 'activo';
              
              return (
                <div 
                  key={reserva.IDReserva}
                  className={`reserva-card ${selectedReserva === reserva.IDReserva ? 'reserva-card-selected' : ''}`}
                >
                  <div className="reserva-content">
                    <div className="reserva-header">
                      <div className="reserva-header-left">
                        <h3 className="reserva-id">Reserva #{reserva.IDReserva}</h3>
                        <span className={`estado-badge ${estadoBadge.class}`}>
                          {estadoBadge.text}
                        </span>
                        {(esPendiente || esActiva) && (
                          <span className={`urgencia-badge ${
                            diasRestantes <= 3 ? 'urgencia-alta' : 
                            diasRestantes <= 7 ? 'urgencia-media' : 'urgencia-baja'
                          }`}>
                            {diasRestantes === 0 ? 'HOY' : diasRestantes === 1 ? 'MAÑANA' : diasRestantes < 0 ? 'PASADA' : `EN ${diasRestantes} DÍAS`}
                          </span>
                        )}
                      </div>
                      <p className="reserva-precio">{formatPrecio(reserva.precio)}</p>
                    </div>

                    <div className="reserva-detalles">
                      <div className="detalle-item">
                        <i className="bi bi-calendar3 detalle-icon"></i>
                        <div>
                          <p className="detalle-label">Ingreso</p>
                          <p className="detalle-value">{formatFecha(reserva.fechaIngreso)}</p>
                        </div>
                      </div>

                      <div className="detalle-item">
                        <i className="bi bi-calendar-check detalle-icon"></i>
                        <div>
                          <p className="detalle-label">Egreso</p>
                          <p className="detalle-value">{formatFecha(reserva.fechaEgreso)}</p>
                        </div>
                      </div>

                      <div className="detalle-item">
                        <i className="bi bi-person detalle-icon"></i>
                        <div>
                          <p className="detalle-label">Usuario</p>
                          <p className="detalle-value">ID: {reserva.IDUsuario}</p>
                        </div>
                      </div>

                      <div className="detalle-item">
                        <i className="bi bi-door-closed detalle-icon"></i>
                        <div>
                          <p className="detalle-label">Habitación</p>
                          <p className="detalle-value">#{reserva.IDHabitacion}</p>
                        </div>
                      </div>
                    </div>

                    {/* Mostrar botones solo si la reserva es pendiente */}
                    {esPendiente && (
                      selectedReserva === reserva.IDReserva ? (
                        <div className="acciones-container">
                          <p className="acciones-title">¿Qué deseas hacer con esta reserva?</p>
                          <div className="acciones-buttons">
                            <button
                              onClick={() => {
                                // Aquí puedes redirigir a una página de modificación
                                console.log('Modificar reserva', reserva.IDReserva);
                                alert('Funcionalidad de modificación en desarrollo');
                              }}
                              className="btn btn-success"
                            >
                              Modificar
                            </button>
                            <button
                              onClick={() => handleChangeEstado(reserva.IDReserva, 'cancelado')}
                              className="btn btn-danger"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => setSelectedReserva(null)}
                              className="btn btn-secondary"
                            >
                              Volver
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedReserva(reserva.IDReserva)}
                          className="btn btn-primary"
                          style={{width: '100%'}}
                        >
                          Gestionar Reserva
                        </button>
                      )
                    )}

                    {/* Mensaje informativo para reservas activas */}
                    {esActiva && (
                      <div className="info-container">
                        <p className="info-text">
                          <i className="bi bi-info-circle"></i> Esta reserva está activa y no puede ser modificada
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="paginacion-container">
            <button
              onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
              disabled={paginaActual === 1}
              className="paginacion-btn"
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            <div className="paginacion-numeros">
              {[...Array(totalPaginas)].map((_, index) => {
                const numeroPagina = index + 1;
                if (
                  numeroPagina === 1 ||
                  numeroPagina === totalPaginas ||
                  (numeroPagina >= paginaActual - 1 && numeroPagina <= paginaActual + 1)
                ) {
                  return (
                    <button
                      key={numeroPagina}
                      onClick={() => setPaginaActual(numeroPagina)}
                      className={`paginacion-numero ${paginaActual === numeroPagina ? 'paginacion-numero-active' : ''}`}
                    >
                      {numeroPagina}
                    </button>
                  );
                } else if (
                  numeroPagina === paginaActual - 2 ||
                  numeroPagina === paginaActual + 2
                ) {
                  return <span key={numeroPagina} className="paginacion-ellipsis">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
              disabled={paginaActual === totalPaginas}
              className="paginacion-btn"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}

        <div className="paginacion-info">
          Mostrando {indiceInicio + 1}-{Math.min(indiceFin, reservasFiltradas.length)} de {reservasFiltradas.length} reservas
        </div>
      </div>
    </div>
  );
}