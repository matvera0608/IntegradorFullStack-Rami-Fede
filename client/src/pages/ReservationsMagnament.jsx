import { useState, useMemo, useEffect } from 'react';
import '../styles/reservationMagnament.css';

export default function ReservasManager() {
  const [reservas, setReservas] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTemporal, setFiltroTemporal] = useState('todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reservasPorPagina = 10;

  useEffect(() => {
  const fetchReservasYUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró token de autenticación');

      // 🔹 1️⃣ Traer todas las reservas
      const resReservas = await fetch('http://localhost:8080/api/reservations/bookings', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (!resReservas.ok) throw new Error(`Error al obtener reservas: ${resReservas.status}`);
      const dataReservas = await resReservas.json();

      const reservasFormateadas = dataReservas.reservas.map(r => ({
        id: r.IDReserva,
        fechaIngreso: r.fechaIngreso.split('T')[0],
        fechaEgreso: r.fechaEgreso.split('T')[0],
        estado: r.estado,
        IDUsuario: r.IDUsuario,
        IDHabitacion: r.IDHabitacion,
        precio: r.precio
      }));
    // 🔹 2️⃣ Traer info de usuarios + tipo de habitación
    const resUsuarios = await fetch('http://localhost:8080/api/usuarios/AllUserInfo', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    if (!resUsuarios.ok) throw new Error('Error al obtener info de usuarios');
    const dataUsuarios = await resUsuarios.json(); 
    const usuariosArray = dataUsuarios.rows; // ✅ Extraer array de rows

    // 🔹 3️⃣ Mapear reservas con nombreUsuario y tipoHabitacion
    // Asumiendo que el orden coincide: primera reserva -> primera fila, etc.
    const reservasConInfo = reservasFormateadas.map((reserva, index) => {
      const info = usuariosArray[index] || {};
      return {
        ...reserva,
        nombreUsuario: info.nombreUsuario || 'Desconocido',
        tipoHabitacion: info.tipoHabitacion || 'Desconocida'
      };
    });
      setReservas(reservasConInfo);
      setError(null);
    } catch (error) {
      console.error('Error cargando reservas y usuarios:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchReservasYUsuarios();
}, []);



  // 📅 Configuración de fechas de filtro
  const hoy = new Date();
  const finSemana = new Date(hoy);
  finSemana.setDate(hoy.getDate() + 7);
  const finProximaSemana = new Date(hoy);
  finProximaSemana.setDate(hoy.getDate() + 14);

  // 🧮 Filtro por estado y temporal
  const reservasFiltradas = useMemo(() => {
    let filtradas = reservas;

    // Filtrar por estado
    if (filtroEstado !== 'todos') {
      filtradas = filtradas.filter(r => r.estado === filtroEstado);
    }

    // Filtrar por tiempo (solo si no es 'todos')
    if (filtroTemporal !== 'todos') {
      filtradas = filtradas.filter(reserva => {
        const fechaIngreso = new Date(reserva.fechaIngreso + 'T00:00:00');
        switch (filtroTemporal) {
          case 'semana':
            return fechaIngreso >= hoy && fechaIngreso <= finSemana;
          case 'proxima':
            return fechaIngreso > finSemana && fechaIngreso <= finProximaSemana;
          case 'mes':
            return fechaIngreso > finProximaSemana;
          default:
            return true;
        }
      });
    }

    // Ordenar: primero pendientes, luego autorizadas, luego activas, luego finalizadas, luego canceladas
    const ordenEstados = { 
      'pendiente': 1, 
      'autorizado': 2, 
      'activo': 3, 
      'finalizado': 4, 
      'cancelado': 5 
    };
    
    return filtradas.sort((a, b) => {
      const estadoA = ordenEstados[a.estado] || 999;
      const estadoB = ordenEstados[b.estado] || 999;
      
      if (estadoA !== estadoB) {
        return estadoA - estadoB;
      }
      
      // Si tienen el mismo estado, ordenar por fecha de ingreso
      return new Date(a.fechaIngreso) - new Date(b.fechaIngreso);
    });
  }, [reservas, filtroEstado, filtroTemporal]);

  // Contadores por estado - CORREGIDOS
  const contadores = useMemo(() => {
    return {
      pendiente: reservas.filter(r => r.estado === 'pendiente').length,
      autorizado: reservas.filter(r => r.estado === 'autorizado').length,
      activo: reservas.filter(r => r.estado === 'activo').length,
      finalizado: reservas.filter(r => r.estado === 'finalizado').length,
      cancelado: reservas.filter(r => r.estado === 'cancelado').length,
      todos: reservas.length
    };
  }, [reservas]);

  // 🧩 Paginación
  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
  const indiceInicio = (paginaActual - 1) * reservasPorPagina;
  const indiceFin = indiceInicio + reservasPorPagina;
  const reservasPaginadas = reservasFiltradas.slice(indiceInicio, indiceFin);

  // Función para cambiar estado - SOLO para reservas pendientes
  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const reserva = reservas.find(r => r.id === id);
      
      // Validar que solo se puedan cambiar reservas pendientes
      if (reserva.estado !== 'pendiente') {
        alert('Solo se pueden cambiar el estado de reservas pendientes');
        return;
      }

      // Validar que solo se pueda cambiar a autorizado o cancelado
      if (nuevoEstado !== 'autorizado' && nuevoEstado !== 'cancelado') {
        alert('Solo se puede cambiar a autorizado o cancelado');
        return;
      }

      // Aquí puedes hacer una llamada al backend para actualizar el estado
       const response = await fetch(`http://localhost:8080/api/reservations/status/${id}`, {
         method: 'PATCH',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify({ estado: nuevoEstado })
       });
      if (!response.ok) {
        throw new Error('No se pudo actualizar la reserva');
      }
      setReservas(reservas.map(r => (r.id === id ? { ...r, estado: nuevoEstado } : r)));
      setSelectedReserva(null);
      
      alert(`Reserva #${id} actualizada a estado: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado de la reserva');
    }
  };

  // Función para verificar si una reserva puede cambiar de estado
  const puedeCambiarEstado = (reserva) => {
    return reserva.estado === 'pendiente';
  };

  const handleFiltroEstadoChange = (nuevoEstado) => {
    setFiltroEstado(nuevoEstado);
    setPaginaActual(1);
  };

  const handleFiltroTemporalChange = (nuevoFiltro) => {
    setFiltroTemporal(nuevoFiltro);
    setPaginaActual(1);
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha + 'T00:00:00');
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
    const fecha = new Date(fechaIngreso + 'T00:00:00');
    const dias = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
    return dias;
  };
  const getEstadoColor = (estado) => {
    const colores = {
      'pendiente': '#fbbf24',      // Amarillo
      'autorizado': '#10b981',     // Verde
      'activo': '#3b82f6',         // Azul
      'finalizado': '#6b7280',     // Gris
      'cancelado': '#ef4444'       // Rojo
    };
    return colores[estado] || '#9ca3af';
  };

  if (loading) {
    return (
      <div className="reservas-container">
        <div className="reservas-wrapper">
          <div className="reservas-header">
            <h1 className="reservas-title">Gestión de Reservas</h1>
            <p className="reservas-subtitle">Cargando reservas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservas-container">
        <div className="reservas-wrapper">
          <div className="reservas-header">
            <h1 className="reservas-title">Gestión de Reservas</h1>
            <p className="reservas-subtitle" style={{ color: 'red' }}>Error: {error}</p>
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
          <p className="reservas-subtitle">Administra todas las reservas del sistema</p>
        </div>

        {/* Filtros por Estado - CORREGIDOS */}
        <div className="filtros-container" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Filtrar por Estado</h3>
          <div className="filtros-buttons">
            <button
              onClick={() => handleFiltroEstadoChange('todos')}
              className={`filtro-btn ${filtroEstado === 'todos' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Todas
              <span className="filtro-count">({contadores.todos})</span>
            </button>
            
            <button
              onClick={() => handleFiltroEstadoChange('pendiente')}
              className={`filtro-btn ${filtroEstado === 'pendiente' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Pendientes
              <span className="filtro-count">({contadores.pendiente})</span>
            </button>
            
            <button
              onClick={() => handleFiltroEstadoChange('autorizado')}
              className={`filtro-btn ${filtroEstado === 'autorizado' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Autorizadas
              <span className="filtro-count">({contadores.autorizado})</span>
            </button>
            
            <button
              onClick={() => handleFiltroEstadoChange('activo')}
              className={`filtro-btn ${filtroEstado === 'activo' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Activas
              <span className="filtro-count">({contadores.activo})</span>
            </button>
            
            <button
              onClick={() => handleFiltroEstadoChange('finalizado')}
              className={`filtro-btn ${filtroEstado === 'finalizado' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Finalizadas
              <span className="filtro-count">({contadores.finalizado})</span>
            </button>
            
            <button
              onClick={() => handleFiltroEstadoChange('cancelado')}
              className={`filtro-btn ${filtroEstado === 'cancelado' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Canceladas
              <span className="filtro-count">({contadores.cancelado})</span>
            </button>
          </div>
        </div>

        {/* Filtros temporales */}
        <div className="filtros-container">
          <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Filtrar por Período</h3>
          <div className="filtros-buttons">
            <button
              onClick={() => handleFiltroTemporalChange('todos')}
              className={`filtro-btn ${filtroTemporal === 'todos' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Todos los períodos
            </button>
            
            <button
              onClick={() => handleFiltroTemporalChange('semana')}
              className={`filtro-btn ${filtroTemporal === 'semana' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Esta Semana
            </button>
            
            <button
              onClick={() => handleFiltroTemporalChange('proxima')}
              className={`filtro-btn ${filtroTemporal === 'proxima' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Próxima Semana
            </button>
            
            <button
              onClick={() => handleFiltroTemporalChange('mes')}
              className={`filtro-btn ${filtroTemporal === 'mes' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Más de 2 Semanas
            </button>
          </div>
        </div>

        {/* Lista de reservas */}
        {reservasPaginadas.length === 0 ? (
          <div className="sin-resultados">
            <p className="sin-resultados-text">No hay reservas que coincidan con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="reservas-lista">
            {reservasPaginadas.map((reserva) => {
              const diasRestantes = getDiasRestantes(reserva.fechaIngreso);
              const puedeCambiar = puedeCambiarEstado(reserva);
              
              return (
                <div 
                  key={reserva.id}
                  className={`reserva-card ${selectedReserva === reserva.id ? 'reserva-card-selected' : ''}`}
                >
                  <div className="reserva-content">
                    <div className="reserva-header">
                      <div className="reserva-header-left">
                        <h3 className="reserva-id">Reserva #{reserva.id}</h3>
                        <span 
                          className="urgencia-badge"
                          style={{ backgroundColor: getEstadoColor(reserva.estado) }}
                        >
                          {reserva.estado.toUpperCase()}
                        </span>
                        {!puedeCambiar && reserva.estado !== 'pendiente' && (
                          <span className="urgencia-badge" style={{ backgroundColor: '#9ca3af' }}>
                            NO MODIFICABLE
                          </span>
                        )}
                        {(reserva.estado === 'autorizado' || reserva.estado === 'activo' || reserva.estado === 'pendiente') ? (
                          <span className={`urgencia-badge ${
                            diasRestantes <= 3 ? 'urgencia-alta' : 
                            diasRestantes <= 7 ? 'urgencia-media' : 'urgencia-baja'
                          }`}>
                            {diasRestantes === 0 ? 'HOY' : diasRestantes === 1 ? 'MAÑANA' : diasRestantes < 0 ? `HACE ${Math.abs(diasRestantes)} DÍAS` : `EN ${diasRestantes} DÍAS`}
                          </span>
                        ) : null}
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
                    <p className="detalle-value">{reserva.nombreUsuario}</p>
                  </div>
                </div>

                <div className="detalle-item">
                  <i className="bi bi-door-closed detalle-icon"></i>
                  <div>
                    <p className="detalle-label">Habitación</p>
                    <p className="detalle-value">{reserva.tipoHabitacion}</p>
                  </div>
                </div>
                    </div>

                    {selectedReserva === reserva.id ? (
                      <div className="acciones-container">
                        {puedeCambiar ? (
                          <>
                            <p className="acciones-title">¿Cambiar estado de la reserva?</p>
                            <div className="acciones-buttons">
                              <button
                                onClick={() => handleChangeEstado(reserva.id, 'autorizado')}
                                className="btn btn-success"
                              >
                                Autorizar
                              </button>
                              <button
                                onClick={() => handleChangeEstado(reserva.id, 'cancelado')}
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
                          </>
                        ) : (
                          <>
                            <p className="acciones-title" style={{ color: '#ef4444' }}>
                              Esta reserva no puede cambiar de estado
                            </p>
                            <div className="acciones-buttons">
                              <button
                                onClick={() => setSelectedReserva(null)}
                                className="btn btn-secondary"
                              >
                                Volver
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedReserva(reserva.id)}
                        className={`btn ${puedeCambiar ? 'btn-primary' : 'btn-secondary'}`}
                        style={{width: '100%'}}
                        disabled={!puedeCambiar}
                      >
                        {puedeCambiar ? 'Cambiar Estado' : 'No Modificable'}
                      </button>
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