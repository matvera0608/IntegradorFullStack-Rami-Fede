/**
 * Función auxiliar para formatear fechas en formato legible
 * @param {string} fechaString - Fecha en formato ISO (ej: 2025-10-16T03:00:00.000Z)
 * @returns {string} Fecha formateada (ej: "16 de octubre de 2025")
 */
export const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'UTC' // Para evitar problemas de zona horaria
    };
    return fecha.toLocaleDateString('es-ES', opciones);
};

/**
 * Función para formatear fecha con hora (si es necesario)
 * @param {string} fechaString - Fecha en formato ISO
 * @returns {string} Fecha y hora formateada
 */
export const formatearFechaHora = (fechaString) => {
    const fecha = new Date(fechaString);
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
};