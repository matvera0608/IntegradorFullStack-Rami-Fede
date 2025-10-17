
/**
 * Verifica si el usuario tiene una reserva activa para la fecha actual
 * @param {string} token - Token JWT del usuario autenticado
 * @returns {Promise<Object>} Objeto con información sobre la reserva activa
 * {
 *   tieneReservaHoy: boolean,
 *   reserva: Object | null,
 *   mensaje: string
 * }
 * 
 
 */export const obtenerHabitacionReservaActiva = async (token) => {
    try {
        // Decodificar el token para obtener el ID del usuario
        const decodedToken = decodeToken(token);
        const userId = decodedToken?.id;

        if (!userId) {
            throw new Error('No se pudo obtener el ID del usuario del token');
        }

        // Obtener las reservas activas del usuario específico
        const response = await fetch(`http://localhost:8080/api/reservations/booking/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener reservas del usuario: ${response.status}`);
        }

        const reservasUsuario = await response.json();

        // Obtener fecha de hoy (sin hora)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Filtrar reservas activas (que incluyan hoy)
        const reservasActivas = reservasUsuario.filter(reserva => {
            const fechaIngreso = new Date(reserva.fechaIngreso);
            const fechaEgreso = new Date(reserva.fechaEgreso);
            
            fechaIngreso.setHours(0, 0, 0, 0);
            fechaEgreso.setHours(0, 0, 0, 0);

            return hoy >= fechaIngreso && hoy <= fechaEgreso;
        });

        if (reservasActivas.length === 0) {
            return {
                tieneReservaActiva: false,
                habitacionId: null,
                reserva: null,
                mensaje: 'No tienes reservas activas'
            };
        }

        // Ordenar reservas por fecha de ingreso (más reciente primero)
        reservasActivas.sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso));

        // Tomar la reserva más reciente
        const reservaMasReciente = reservasActivas[0];

        return {
            tieneReservaActiva: true,
            habitacionId: reservaMasReciente.IDHabitacion,
            reserva: reservaMasReciente,
            mensaje: `Reserva activa encontrada (Habitación ID: ${reservaMasReciente.IDHabitacion})`
        };

    } catch (error) {
        console.error('Error al obtener habitación de reserva activa:', error);
        throw error;
    }
};
export const obtenerDetallesReservaActiva = async (token) => {
    try {
        // Decodificar token
        const decodedToken = decodeToken(token);
        const userId = decodedToken?.id;

        if (!userId) {
            throw new Error('No se pudo obtener el ID del usuario del token');
        }

        // Obtener todas las reservas del usuario
        const response = await fetch(`http://localhost:8080/api/reservations/booking/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener reservas del usuario: ${response.status}`);
        }

        const reservasUsuario = await response.json();

        // Fecha actual (sin hora)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Filtrar reservas activas o pendientes
        const reservasValidas = reservasUsuario.filter(reserva => {
            const fechaIngreso = new Date(reserva.fechaIngreso);
            const fechaEgreso = new Date(reserva.fechaEgreso);
            fechaIngreso.setHours(0, 0, 0, 0);
            fechaEgreso.setHours(0, 0, 0, 0);

            // “Activa” si incluye hoy
            const activa = hoy >= fechaIngreso && hoy <= fechaEgreso;
            // “Pendiente” si todavía no empezó
            const pendiente = hoy < fechaIngreso && reserva.estado === 'pendiente';

            return activa || pendiente;
        });

        if (reservasValidas.length === 0) {
            return {
                tieneReservaActiva: false,
                reserva: null,
                mensaje: 'No tienes reservas activas ni pendientes'
            };
        }

        // Tomar la más reciente
        reservasValidas.sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso));
        const reservaMasReciente = reservasValidas[0];

        return {
            tieneReservaActiva: true,
            reserva: {
                id: reservaMasReciente.ID,
                IDHabitacion: reservaMasReciente.IDHabitacion,
                fechaIngreso: reservaMasReciente.fechaIngreso,
                fechaEgreso: reservaMasReciente.fechaEgreso,
                precio: reservaMasReciente.precio,
                estado: reservaMasReciente.estado
            },
            mensaje: 'Reserva activa o pendiente encontrada'
        };

    } catch (error) {
        console.error('Error al obtener detalles de reserva activa:', error);
        return {
            tieneReservaActiva: false,
            reserva: null,
            mensaje: 'Error al obtener la reserva activa'
        };
    }
};

export const verificarReservaActivaHoy = async (token) => {
    try {
        // Obtener todas las reservas activas
        const response = await fetch('http://localhost:8080/api/reservations/active', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener reservas: ${response.status}`);
        }

        const reservasActivas = await response.json();

        // Decodificar el token para obtener el ID del usuario
        const decodedToken = decodeToken(token);
        const userId = decodedToken?.IDUsuario || decodedToken?.id;

        if (!userId) {
            throw new Error('No se pudo obtener el ID del usuario del token');
        }

        // Obtener fecha de hoy (sin hora)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Buscar si el usuario tiene alguna reserva que incluya el día de hoy
        const reservaHoy = reservasActivas.find(reserva => {
            // Verificar que la reserva pertenezca al usuario
            if (reserva.IDUsuario !== userId) {
                return false;
            }

            // Convertir fechas de la reserva
            const fechaIngreso = new Date(reserva.fechaIngreso);
            const fechaEgreso = new Date(reserva.fechaEgreso);
            
            // Normalizar fechas (sin hora)
            fechaIngreso.setHours(0, 0, 0, 0);
            fechaEgreso.setHours(0, 0, 0, 0);

            // Verificar si hoy está dentro del rango de la reserva
            return hoy >= fechaIngreso && hoy <= fechaEgreso;
        });

        if (reservaHoy) {
            return {
                tieneReservaHoy: true,
                reserva: reservaHoy,
                mensaje: `Tienes una reserva activa hoy (Habitación ID: ${reservaHoy.IDHabitacion})`
            };
        } else {
            return {
                tieneReservaHoy: false,
                reserva: null,
                mensaje: 'No tienes reservas activas para hoy'
            };
        }

    } catch (error) {
        console.error('Error al verificar reserva activa:', error);
        throw error;
    }
};

/**
 * Obtiene todas las reservas activas del usuario actual
 * @param {string} token - Token JWT del usuario autenticado
 * @returns {Promise<Array>} Array de reservas activas del usuario
 */
export const obtenerReservasActivasUsuario = async (token) => {
    try {
        const response = await fetch('http://localhost:8080/api/reservations/active', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener reservas: ${response.status}`);
        }

        const reservasActivas = await response.json();

        // Decodificar el token para obtener el ID del usuario
        const decodedToken = decodeToken(token);
        const userId = decodedToken?.IDUsuario || decodedToken?.id;

        if (!userId) {
            throw new Error('No se pudo obtener el ID del usuario del token');
        }

        // Filtrar solo las reservas del usuario actual
        const reservasUsuario = reservasActivas.filter(
            reserva => reserva.IDUsuario === userId
        );

        return reservasUsuario;

    } catch (error) {
        console.error('Error al obtener reservas del usuario:', error);
        throw error;
    }
};

/**
 * Verifica si el usuario tiene alguna reserva activa en un rango de fechas específico
 * @param {string} token - Token JWT del usuario autenticado
 * @param {string} fechaInicio - Fecha de inicio en formato YYYY-MM-DD
 * @param {string} fechaFin - Fecha de fin en formato YYYY-MM-DD
 * @returns {Promise<Object>} Objeto con información sobre reservas en el rango
 */
export const verificarReservaEnRango = async (token, fechaInicio, fechaFin) => {
    try {
        const response = await fetch('http://localhost:8080/api/reservations/active', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener reservas: ${response.status}`);
        }

        const reservasActivas = await response.json();

        const decodedToken = decodeToken(token);
        const userId = decodedToken?.IDUsuario || decodedToken?.id;

        if (!userId) {
            throw new Error('No se pudo obtener el ID del usuario del token');
        }

        // Normalizar fechas de búsqueda
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        inicio.setHours(0, 0, 0, 0);
        fin.setHours(0, 0, 0, 0);

        // Buscar reservas que se solapen con el rango especificado
        const reservasEnRango = reservasActivas.filter(reserva => {
            if (reserva.IDUsuario !== userId) {
                return false;
            }

            const fechaIngreso = new Date(reserva.fechaIngreso);
            const fechaEgreso = new Date(reserva.fechaEgreso);
            fechaIngreso.setHours(0, 0, 0, 0);
            fechaEgreso.setHours(0, 0, 0, 0);

            // Verificar si hay solapamiento
            return (
                (fechaIngreso <= fin && fechaEgreso >= inicio)
            );
        });

        return {
            tieneReservas: reservasEnRango.length > 0,
            cantidad: reservasEnRango.length,
            reservas: reservasEnRango,
            mensaje: reservasEnRango.length > 0
                ? `Tienes ${reservasEnRango.length} reserva(s) en el rango especificado`
                : 'No tienes reservas en el rango especificado'
        };

    } catch (error) {
        console.error('Error al verificar reservas en rango:', error);
        throw error;
    }
};

/**
 * Función auxiliar para decodificar el token JWT
 * @param {string} token - Token JWT
 * @returns {Object|null} Payload decodificado o null si hay error
 */
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
/**
 * Valida si el usuario puede realizar una nueva reserva
 * Un usuario NO puede hacer una nueva reserva si tiene alguna reserva activa o pendiente
 * @param {string} token - Token JWT del usuario autenticado
 * @returns {Promise<Object>} Objeto con información de validación
 */
export const validarPuedeReservar = async (token) => {
    try {
        // Decodificar el token para obtener el ID del usuario PRIMERO
       const decodedToken = decodeToken(token);
        const userId = decodedToken?.id;  // ✅ Solo usa esta propiedad

        if (!userId) {
            throw new Error('No se pudo obtener el ID del usuario del token');
        }

        console.log('🔑 ID Usuario obtenido del token:', userId);

        // 🔄 Usar el endpoint que trae las reservas del usuario específico
        const response = await fetch(`http://localhost:8080/api/reservations/booking/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener reservas: ${response.status}`);
        }

        const todasLasReservas = await response.json();

        console.log('📋 TODAS las reservas del usuario:', todasLasReservas);

        // 🔍 Filtrar reservas que NO estén canceladas o finalizadas
        const reservasActivas = todasLasReservas.filter(reserva => {
            const estado = reserva.estado?.toLowerCase();
            return !['cancelada', 'finalizada', 'rechazada'].includes(estado);
        });

        console.log('🔍 Reservas activas/pendientes:', reservasActivas);

        const tieneReservaActiva = reservasActivas.length > 0;
        
        if (tieneReservaActiva) {
            // Encontrar la reserva más reciente (con fecha de egreso más lejana)
            const reservaActual = reservasActivas.reduce((masReciente, reserva) => {
                return new Date(reserva.fechaEgreso) > new Date(masReciente.fechaEgreso) 
                    ? reserva : masReciente;
            });
            
            return {
                puedeReservar: false,
                motivo: `No puedes realizar una nueva reserva mientras tengas reservas activas o pendientes. Tu reserva actual (${reservaActual.estado}) finaliza el ${formatearFecha(reservaActual.fechaEgreso)}.`,
                reservaActual: reservaActual
            };
        }

        return {
            puedeReservar: true,
            motivo: 'Puedes realizar una nueva reserva',
            reservaActual: null
        };

    } catch (error) {
        console.error('Error al validar si puede reservar:', error);
        throw error;
    }
};
/**
 * Función auxiliar para formatear fechas en formato legible
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', opciones);
};

// Exportar también la función de decodificación por si se necesita externamente
export { decodeToken };