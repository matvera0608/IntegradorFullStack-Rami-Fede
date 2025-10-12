import { useState, useMemo } from 'react';
import '../styles/reservationMagnament.css';

export default function ReservasManager() {
  const [reservas, setReservas] = useState([
    { id: 1, fechaIngreso: '2025-10-11', fechaEgreso: '2025-10-14', estado: 'pendiente', IDUsuario: 5, IDHabitacion: 101, precio: 45000 },
    { id: 2, fechaIngreso: '2025-10-12', fechaEgreso: '2025-10-15', estado: 'pendiente', IDUsuario: 12, IDHabitacion: 205, precio: 60000 },
    { id: 3, fechaIngreso: '2025-10-13', fechaEgreso: '2025-10-16', estado: 'pendiente', IDUsuario: 8, IDHabitacion: 103, precio: 52000 },
    { id: 4, fechaIngreso: '2025-10-14', fechaEgreso: '2025-10-17', estado: 'pendiente', IDUsuario: 20, IDHabitacion: 301, precio: 80000 },
    { id: 5, fechaIngreso: '2025-10-15', fechaEgreso: '2025-10-18', estado: 'pendiente', IDUsuario: 15, IDHabitacion: 102, precio: 48000 },
    { id: 6, fechaIngreso: '2025-10-18', fechaEgreso: '2025-10-21', estado: 'pendiente', IDUsuario: 7, IDHabitacion: 204, precio: 55000 },
    { id: 7, fechaIngreso: '2025-10-19', fechaEgreso: '2025-10-22', estado: 'pendiente', IDUsuario: 25, IDHabitacion: 105, precio: 47000 },
    { id: 8, fechaIngreso: '2025-10-20', fechaEgreso: '2025-10-23', estado: 'pendiente', IDUsuario: 11, IDHabitacion: 302, precio: 72000 },
    { id: 9, fechaIngreso: '2025-10-22', fechaEgreso: '2025-10-25', estado: 'pendiente', IDUsuario: 9, IDHabitacion: 201, precio: 58000 },
    { id: 10, fechaIngreso: '2025-10-25', fechaEgreso: '2025-10-28', estado: 'pendiente', IDUsuario: 18, IDHabitacion: 104, precio: 51000 },
    { id: 11, fechaIngreso: '2025-10-28', fechaEgreso: '2025-10-31', estado: 'pendiente', IDUsuario: 22, IDHabitacion: 203, precio: 62000 },
    { id: 12, fechaIngreso: '2025-11-01', fechaEgreso: '2025-11-04', estado: 'pendiente', IDUsuario: 14, IDHabitacion: 106, precio: 49000 },
    { id: 13, fechaIngreso: '2025-11-03', fechaEgreso: '2025-11-06', estado: 'pendiente', IDUsuario: 6, IDHabitacion: 303, precio: 78000 },
    { id: 14, fechaIngreso: '2025-11-05', fechaEgreso: '2025-11-08', estado: 'pendiente', IDUsuario: 19, IDHabitacion: 202, precio: 59000 },
    { id: 15, fechaIngreso: '2025-11-08', fechaEgreso: '2025-11-11', estado: 'pendiente', IDUsuario: 23, IDHabitacion: 107, precio: 46000 },
    { id: 16, fechaIngreso: '2025-11-10', fechaEgreso: '2025-11-13', estado: 'pendiente', IDUsuario: 13, IDHabitacion: 304, precio: 81000 },
    { id: 17, fechaIngreso: '2025-11-12', fechaEgreso: '2025-11-15', estado: 'pendiente', IDUsuario: 17, IDHabitacion: 108, precio: 53000 },
    { id: 18, fechaIngreso: '2025-11-15', fechaEgreso: '2025-11-18', estado: 'pendiente', IDUsuario: 21, IDHabitacion: 206, precio: 64000 },
    { id: 19, fechaIngreso: '2025-11-18', fechaEgreso: '2025-11-21', estado: 'pendiente', IDUsuario: 10, IDHabitacion: 109, precio: 50000 },
    { id: 20, fechaIngreso: '2025-11-20', fechaEgreso: '2025-11-23', estado: 'pendiente', IDUsuario: 16, IDHabitacion: 305, precio: 75000 },
    { id: 21, fechaIngreso: '2025-12-01', fechaEgreso: '2025-12-05', estado: 'pendiente', IDUsuario: 24, IDHabitacion: 110, precio: 65000 },
    { id: 22, fechaIngreso: '2025-12-05', fechaEgreso: '2025-12-08', estado: 'pendiente', IDUsuario: 26, IDHabitacion: 207, precio: 57000 },
    { id: 23, fechaIngreso: '2025-12-10', fechaEgreso: '2025-12-13', estado: 'pendiente', IDUsuario: 28, IDHabitacion: 111, precio: 54000 },
    { id: 24, fechaIngreso: '2025-12-15', fechaEgreso: '2025-12-18', estado: 'pendiente', IDUsuario: 30, IDHabitacion: 306, precio: 82000 },
    { id: 25, fechaIngreso: '2025-12-20', fechaEgreso: '2025-12-23', estado: 'pendiente', IDUsuario: 32, IDHabitacion: 112, precio: 56000 },
    { id: 26, fechaIngreso: '2025-12-25', fechaEgreso: '2025-12-28', estado: 'pendiente', IDUsuario: 34, IDHabitacion: 208, precio: 68000 },
    { id: 27, fechaIngreso: '2026-01-05', fechaEgreso: '2026-01-08', estado: 'pendiente', IDUsuario: 36, IDHabitacion: 113, precio: 52000 },
    { id: 28, fechaIngreso: '2026-01-10', fechaEgreso: '2026-01-13', estado: 'pendiente', IDUsuario: 38, IDHabitacion: 307, precio: 79000 },
    { id: 29, fechaIngreso: '2026-01-15', fechaEgreso: '2026-01-18', estado: 'pendiente', IDUsuario: 40, IDHabitacion: 114, precio: 55000 },
    { id: 30, fechaIngreso: '2026-01-20', fechaEgreso: '2026-01-23', estado: 'pendiente', IDUsuario: 42, IDHabitacion: 209, precio: 63000 },
    { id: 31, fechaIngreso: '2026-02-01', fechaEgreso: '2026-02-04', estado: 'pendiente', IDUsuario: 44, IDHabitacion: 115, precio: 58000 },
    { id: 32, fechaIngreso: '2026-02-10', fechaEgreso: '2026-02-13', estado: 'pendiente', IDUsuario: 46, IDHabitacion: 308, precio: 84000 },
    { id: 33, fechaIngreso: '2026-02-15', fechaEgreso: '2026-02-18', estado: 'pendiente', IDUsuario: 48, IDHabitacion: 116, precio: 51000 },
    { id: 34, fechaIngreso: '2026-02-20', fechaEgreso: '2026-02-23', estado: 'pendiente', IDUsuario: 50, IDHabitacion: 210, precio: 66000 },
    { id: 35, fechaIngreso: '2026-03-01', fechaEgreso: '2026-03-04', estado: 'pendiente', IDUsuario: 52, IDHabitacion: 117, precio: 59000 }
  ]);

  const [selectedReserva, setSelectedReserva] = useState(null);
  const [filtroTemporal, setFiltroTemporal] = useState('semana');
  const [paginaActual, setPaginaActual] = useState(1);
  const reservasPorPagina = 10;

  const hoy = new Date('2025-10-10');
  const finSemana = new Date(hoy);
  finSemana.setDate(hoy.getDate() + 7);
  const finProximaSemana = new Date(hoy);
  finProximaSemana.setDate(hoy.getDate() + 14);

  const reservasFiltradas = useMemo(() => {
    let filtradas = reservas.filter(r => r.estado === 'pendiente');
    
    filtradas = filtradas.filter(reserva => {
      const fechaIngreso = new Date(reserva.fechaIngreso + 'T00:00:00');
      
      switch(filtroTemporal) {
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

    return filtradas.sort((a, b) => 
      new Date(a.fechaIngreso) - new Date(b.fechaIngreso)
    );
  }, [reservas, filtroTemporal]);

  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
  const indiceInicio = (paginaActual - 1) * reservasPorPagina;
  const indiceFin = indiceInicio + reservasPorPagina;
  const reservasPaginadas = reservasFiltradas.slice(indiceInicio, indiceFin);

  const handleChangeEstado = (id, nuevoEstado) => {
    setReservas(reservas.map(r => 
      r.id === id ? { ...r, estado: nuevoEstado } : r
    ));
    setSelectedReserva(null);
  };

  const handleFiltroChange = (nuevoFiltro) => {
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

  return (
    <div className="reservas-container">
      <div className="reservas-wrapper">
        <div className="reservas-header">
          <h1 className="reservas-title">Gestión de Reservas</h1>
          <p className="reservas-subtitle">Administra las reservas por prioridad temporal</p>
        </div>

        {/* Filtros temporales */}
        <div className="filtros-container">
          <div className="filtros-buttons">
            <button
              onClick={() => handleFiltroChange('semana')}
              className={`filtro-btn ${filtroTemporal === 'semana' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Esta Semana
              <span className="filtro-count">
                ({reservas.filter(r => {
                  const fecha = new Date(r.fechaIngreso + 'T00:00:00');
                  return r.estado === 'pendiente' && fecha >= hoy && fecha <= finSemana;
                }).length})
              </span>
            </button>
            
            <button
              onClick={() => handleFiltroChange('proxima')}
              className={`filtro-btn ${filtroTemporal === 'proxima' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Próxima Semana
              <span className="filtro-count">
                ({reservas.filter(r => {
                  const fecha = new Date(r.fechaIngreso + 'T00:00:00');
                  return r.estado === 'pendiente' && fecha > finSemana && fecha <= finProximaSemana;
                }).length})
              </span>
            </button>
            
            <button
              onClick={() => handleFiltroChange('mes')}
              className={`filtro-btn ${filtroTemporal === 'mes' ? 'filtro-btn-active' : 'filtro-btn-inactive'}`}
            >
              Más de 2 Semanas
              <span className="filtro-count">
                ({reservas.filter(r => {
                  const fecha = new Date(r.fechaIngreso + 'T00:00:00');
                  return r.estado === 'pendiente' && fecha > finProximaSemana;
                }).length})
              </span>
            </button>
          </div>
        </div>

        {/* Lista de reservas */}
        {reservasPaginadas.length === 0 ? (
          <div className="sin-resultados">
            <p className="sin-resultados-text">No hay reservas pendientes en este período</p>
          </div>
        ) : (
          <div className="reservas-lista">
            {reservasPaginadas.map((reserva) => {
              const diasRestantes = getDiasRestantes(reserva.fechaIngreso);
              return (
                <div 
                  key={reserva.id}
                  className={`reserva-card ${selectedReserva === reserva.id ? 'reserva-card-selected' : ''}`}
                >
                  <div className="reserva-content">
                    <div className="reserva-header">
                      <div className="reserva-header-left">
                        <h3 className="reserva-id">Reserva #{reserva.id}</h3>
                        <span className={`urgencia-badge ${
                          diasRestantes <= 3 ? 'urgencia-alta' : 
                          diasRestantes <= 7 ? 'urgencia-media' : 'urgencia-baja'
                        }`}>
                          {diasRestantes === 0 ? 'HOY' : diasRestantes === 1 ? 'MAÑANA' : `EN ${diasRestantes} DÍAS`}
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

                    {selectedReserva === reserva.id ? (
                      <div className="acciones-container">
                        <p className="acciones-title">¿Cambiar estado de la reserva?</p>
                        <div className="acciones-buttons">
                          <button
                            onClick={() => handleChangeEstado(reserva.id, 'activo')}
                            className="btn btn-success"
                          >
                            Activar
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
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedReserva(reserva.id)}
                        className="btn btn-primary"
                        style={{width: '100%'}}
                      >
                        Cambiar Estado
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