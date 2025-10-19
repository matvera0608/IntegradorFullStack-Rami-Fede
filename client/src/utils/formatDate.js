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
/**
 * ✅ Función para formatear fecha al formato "yyyy-MM-dd"
 * Ideal para inputs de tipo="date"
 * @param {string|Date} fecha - Fecha en formato ISO o Date
 * @returns {string} Fecha en formato "yyyy-MM-dd"
 */
export const formatearFechaInput = (fecha) => {
    if (!fecha) return '';
    const dateObj = new Date(fecha);
    // Asegura formato compatible con input type="date"
    return dateObj.toISOString().split('T')[0];
};