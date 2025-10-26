import { useState, useMemo, useEffect,useRef } from 'react';
import '../styles/reservationMagnament.css';
import { formatearFechaInput } from '../utils/formatDate';
export default function MyBooking() {
  const [reservas, setReservas] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [filtroTemporal, setFiltroTemporal] = useState('actuales'); // por defecto todas
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reservasPorPagina = 10;
  const [showForm, setShowForm] = useState(false);
 const [formData, setFormData] = useState({
  checkIn: '',
  checkOut: '',
  comments: ''
});
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleChangeVolver = () => {
    setSelectedReserva(null);
    setShowForm(false);
  }

 const handleUpdateReserva = (reserva, id) => {
  setSelectedReserva(id);

  // Setear los valores de la reserva seleccionada
  setFormData({
  checkIn: formatearFechaInput(reserva.fechaIngreso),
  checkOut: formatearFechaInput(reserva.fechaEgreso),
  comments: reserva.comentarios || ''
});

  setShowForm(true);
};
// Actualiza una reserva existente
const updateBooking = async (e, idReserva) => {
  e.preventDefault();

  try {
    // Token de autenticación guardado al iniciar sesión
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para modificar tu reserva.');
      return;
    }

  const response = await fetch(`http://localhost:8080/api/reservations/booking/${idReserva}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    fechaIngreso: formData.checkIn,
    fechaEgreso: formData.checkOut,
    estado: 'pendiente',
  })
});

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'No se pudo actualizar la reserva');
    }

    alert('Reserva actualizada con éxito.');

    // 🔄 Actualiza la lista local de reservas sin recargar la página
    setReservas(prev =>
      prev.map(r =>
        r.IDReserva === idReserva
          ? { ...r, fechaIngreso: formData.checkIn, fechaEgreso: formData.checkOut, comments: formData.comments }
          : r
      )
    );

    setShowForm(false);
    setSelectedReserva(null);
  } catch (error) {
    console.error('Error al actualizar la reserva:', error);
    alert('Error al actualizar la reserva. Intenta nuevamente.');
  }
};

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

  const fetchInfoUsuarioYHabitacion = async (userId, token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/usuarios/infoUser/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Error al obtener info del usuario');
    const data = await response.json();

    // ✅ el backend devuelve { rows: [...] }
    const row = Array.isArray(data.rows) ? data.rows[0] : null;
    return row || {}; 
  } catch (error) {
    console.error('Error al obtener info de usuario y habitación:', error);
    return {};
  }
};

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

      // 🔹 1. Obtener las reservas del usuario
      const response = await fetch(`http://localhost:8080/api/reservations/booking/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al cargar las reservas');
      const data = await response.json();

      // 🔹 2. Enriquecer cada reserva con nombreUsuario y tipoHabitacion
      const reservasConInfo = await Promise.all(
        data.map(async (reserva) => {
          const info = await fetchInfoUsuarioYHabitacion(reserva.IDUsuario, token);
          return {
            ...reserva,
            nombreUsuario: info?.nombreUsuario || 'Desconocido',
            tipoHabitacion: info?.tipoHabitacion || `#${reserva.IDHabitacion}`,
          };
        })
      );

      setReservas(reservasConInfo);
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


 // Filtrado de reservas según el filtro temporal
const reservasFiltradas = useMemo(() => {
  if (filtroTemporal === 'todas') return reservas;
  if (filtroTemporal === 'actuales') 
    return reservas.filter(
      r => r.estado === 'pendiente' || r.estado === 'activo' || r.estado === 'autorizado'
    );
  if (filtroTemporal === 'pasadas') return reservas.filter(r => r.estado === 'finalizado');
  return reservas;
}, [reservas, filtroTemporal]);

  // Paginación
  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
  const indiceInicio = (paginaActual - 1) * reservasPorPagina;
  const indiceFin = indiceInicio + reservasPorPagina;
  const reservasPaginadas = reservasFiltradas.slice(indiceInicio, indiceFin);
  // 🔹 Trae el nombre del usuario y la descripción de la habitación


  // Cambiar estado de reserva
  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/reservations/status/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) throw new Error('Error al actualizar el estado la reserva');

      setReservas(reservas.map(r => r.IDReserva === id ? { ...r, estado: nuevoEstado } : r));
      setSelectedReserva(null);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al actualizar la reserva');
    }
  };

  // Cambiar filtro temporal
  const handleFiltroChange = (nuevoFiltro) => {
    setFiltroTemporal(nuevoFiltro);
    setPaginaActual(1);
  };

  // Funciones de formato
  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
  const formatPrecio = (precio) => new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(precio);

  const getDiasRestantes = (fechaIngreso) => {
    const fecha = new Date(fechaIngreso);
    fecha.setHours(0, 0, 0, 0);
    return Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
  };

const getEstadoBadge = (estado) => ({
  'pendiente': { text: 'Pendiente', class: 'badge-warning' },
  'activo': { text: 'Activa', class: 'badge-success' },
  'autorizado': { text: 'Autorizada', class: 'badge-info' },
  'finalizado': { text: 'Finalizada', class: 'badge-secondary' },
  'cancelado': { text: 'Cancelada', class: 'badge-danger' }
}[estado] || { text: estado, class: 'badge-default' });

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
      {/* Header */}
      <div className="reservas-header">
        <h1 className="reservas-title">Gestión de Reservas</h1>
        <p className="reservas-subtitle">Administra tus reservas</p>
      </div>

      {/* Filtros temporales */}
      <div className="filtros-container">
        <div className="filtros-buttons">
          <button
            onClick={() => handleFiltroChange('todas')}
            className={`filtro-btn ${filtroTemporal === 'todas' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
          >
            Todas
            <span className="filtro-count">({reservas.length})</span>
          </button>
          <button
            onClick={() => handleFiltroChange('actuales')}
            className={`filtro-btn ${filtroTemporal === 'actuales' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
          >
            Mis Reservas
            <span className="filtro-count">
              ({reservas.filter(r => r.estado === 'pendiente' || r.estado === 'activo' || r.estado === 'autorizado').length})
            </span>
          </button>
          <button
            onClick={() => handleFiltroChange('pasadas')}
            className={`filtro-btn ${filtroTemporal === 'pasadas' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
          >
            Reservas Pasadas
            <span className="filtro-count">({reservas.filter(r => r.estado === 'finalizado').length})</span>
          </button>
        </div>
      </div>

      {/* Lista de reservas */}
      {reservasPaginadas.length === 0 ? (
        <div className="sin-resultados">
          <p className="sin-resultados-text">
            {filtroTemporal === 'actuales'
              ? 'No tienes reservas activas o pendientes'
              : filtroTemporal === 'pasadas'
                ? 'No tienes reservas pasadas'
                : 'No tienes reservas'}
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
                        <p className="detalle-value">ID: {reserva.nombreUsuario}</p>
                      </div>
                    </div>

                    <div className="detalle-item">
                      <i className="bi bi-door-closed detalle-icon"></i>
                      <div>
                        <p className="detalle-label">Habitación</p>
                        {/* aca necesito que traigas la descripción de la habitación:*/}
                        <p className="detalle-value">{reserva.tipoHabitacion}</p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones solo si la reserva es pendiente */}
                  {esPendiente && (
                    selectedReserva === reserva.IDReserva ? (
                      <div className="acciones-container">
                        <p className="acciones-title">¿Qué deseas hacer con esta reserva?</p>
                        <div className="acciones-buttons">
                          <button
                            onClick={() => handleUpdateReserva(reserva,reserva.IDReserva)}
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
                            onClick={() => handleChangeVolver()}
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
                        style={{ width: '100%' }}
                      >
                        Gestionar Reserva
                      </button>
                    )
                  )}
                {showForm && selectedReserva === reserva.IDReserva && (
                            <section className="reservation-form-section visible">
                              <div className="reservation-container">
                                <div className="reservation-form-container">
                                  <h2 className="reservation-form-title">
                                    Modifica tu Reserva - Habitación #{reserva.IDHabitacion}
                                  </h2>

                                 <form className="reservation-form" onSubmit={(e) => updateBooking(e, reserva.IDReserva)}>

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
                                      Guardar Cambios
                                    </button>
                                  </form>
                                </div>
                              </div>
                            </section>
                          )}

                  {/* Info para reservas activas */}
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
