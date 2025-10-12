// utils/reservationUtils.js

/**
 * Función auxiliar para obtener todas las fechas entre dos fechas (inclusive)
 * @param {string} startDate - Fecha inicio formato 'YYYY-MM-DD'
 * @param {string} endDate - Fecha fin formato 'YYYY-MM-DD'
 * @returns {string[]} Array de fechas en formato 'YYYY-MM-DD'
 */
const obtenerRangoDeFechas = (startDate, endDate) => {
    const fechas = [];
    const inicio = new Date(startDate);
    const fin = new Date(endDate);
    
    // Ajustar a medianoche para evitar problemas de zona horaria
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    
    const actual = new Date(inicio);
    
    while (actual < fin) {
        fechas.push(actual.toISOString().split('T')[0]);
        actual.setDate(actual.getDate() + 1);
    }
    
    return fechas;
};

/**
 * Contar cuántas habitaciones están ocupadas en un rango de fechas
 * Devuelve el máximo de reservas simultáneas en cualquier día del período
 * 
 * @param {number} roomId - ID de la habitación
 * @param {string} checkIn - Fecha de entrada formato 'YYYY-MM-DD'
 * @param {string} checkOut - Fecha de salida formato 'YYYY-MM-DD'
 * @param {Array} reservasActivas - Array de reservas activas
 * @returns {number} Máximo número de reservas simultáneas
 */
export const contarReservasSimultaneas = (roomId, checkIn, checkOut, reservasActivas) => {
    console.log('🔍 Contando reservas simultáneas:', { roomId, checkIn, checkOut });
    
    // Filtrar solo reservas de esta habitación
    const reservasRoom = reservasActivas.filter(reserva => 
        reserva.IDHabitacion === roomId && reserva.estado === 'activo'
    );
    
    console.log(`📋 Reservas activas para habitación ${roomId}:`, reservasRoom.length);
    
    if (reservasRoom.length === 0) {
        console.log('✅ No hay reservas activas');
        return 0;
    }
    
    // Obtener todas las fechas en el rango solicitado
    const fechasRango = obtenerRangoDeFechas(checkIn, checkOut);
    console.log(`📅 Fechas a verificar (${fechasRango.length} días):`, fechasRango);
    
    // Contar cuántas reservas hay en cada día
    let maxReservasSimultaneas = 0;
    
    fechasRango.forEach(fecha => {
        const fechaActual = new Date(fecha);
        fechaActual.setHours(0, 0, 0, 0);
        
        // Contar cuántas reservas están activas en esta fecha
        const reservasEnEsteFecha = reservasRoom.filter(reserva => {
            const reservaInicio = new Date(reserva.fechaIngreso);
            const reservaFin = new Date(reserva.fechaEgreso);
            
            reservaInicio.setHours(0, 0, 0, 0);
            reservaFin.setHours(0, 0, 0, 0);
            
            // La reserva está activa si la fecha actual está dentro del rango
            return fechaActual >= reservaInicio && fechaActual < reservaFin;
        }).length;
        
        if (reservasEnEsteFecha > maxReservasSimultaneas) {
            maxReservasSimultaneas = reservasEnEsteFecha;
            console.log(`📊 Nuevo máximo en ${fecha}: ${reservasEnEsteFecha} reservas`);
        }
    });
    
    console.log(`🎯 Máximo de reservas simultáneas: ${maxReservasSimultaneas}`);
    return maxReservasSimultaneas;
};

/**
 * Validar capacidad de habitaciones en un rango de fechas
 * 
 * @param {number} roomId - ID de la habitación
 * @param {string} checkIn - Fecha de entrada formato 'YYYY-MM-DD'
 * @param {string} checkOut - Fecha de salida formato 'YYYY-MM-DD'
 * @param {Array} reservasActivas - Array de reservas activas
 * @param {number} capacidadTotal - Capacidad total de habitaciones (default: 10)
 * @returns {Object} { disponible: boolean, ocupadas: number, disponibles: number }
 */
export const validarCapacidad = (roomId, checkIn, checkOut, reservasActivas, capacidadTotal = 10) => {
    console.log('🔍 Validando capacidad:', { roomId, checkIn, checkOut, capacidadTotal });
    
    // Contar reservas simultáneas
    const ocupadas = contarReservasSimultaneas(roomId, checkIn, checkOut, reservasActivas);
    const disponibles = capacidadTotal - ocupadas;
    const disponible = disponibles > 0;
    
    const resultado = {
        disponible,
        ocupadas,
        disponibles,
        capacidadTotal,
        mensaje: disponible 
            ? `Hay ${disponibles} habitación(es) disponible(s)` 
            : 'No hay habitaciones disponibles en estas fechas'
    };
    
    console.log('✅ Resultado de validación:', resultado);
    return resultado;
};

/**
 * Calcular fechas sugeridas considerando capacidad máxima
 * Busca el primer período de 2 noches donde haya disponibilidad
 * 
 * @param {number} roomId - ID de la habitación
 * @param {Array} reservasActivas - Array de reservas activas
 * @param {number} capacidadTotal - Capacidad total de habitaciones (default: 10)
 * @param {number} nochesMinimas - Número de noches mínimas (default: 2)
 * @returns {Object} { checkIn: string, checkOut: string, mensaje: string, disponibles: number }
 */
export const calcularFechasSugeridaConCapacidad = (roomId, reservasActivas, capacidadTotal = 10, nochesMinimas = 2) => {
    console.log('🔍 Calculando fechas sugeridas con capacidad:', { roomId, capacidadTotal, nochesMinimas });
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Filtrar reservas de esta habitación
    const reservasRoom = reservasActivas.filter(reserva => 
        reserva.IDHabitacion === roomId && reserva.estado === 'activo'
    );
    
    console.log(`📋 Total de reservas activas para habitación ${roomId}:`, reservasRoom.length);
    
    // Si no hay reservas, sugerir desde mañana
    if (reservasRoom.length === 0) {
        const checkIn = new Date(hoy);
        checkIn.setDate(hoy.getDate() + 1);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkIn.getDate() + nochesMinimas);
        
        return {
            checkIn: checkIn.toISOString().split('T')[0],
            checkOut: checkOut.toISOString().split('T')[0],
            mensaje: 'Disponible desde mañana',
            disponibles: capacidadTotal
        };
    }
    
    // Buscar el próximo período disponible (hasta 90 días en el futuro)
    for (let diasDesdeHoy = 1; diasDesdeHoy <= 90; diasDesdeHoy++) {
        const checkIn = new Date(hoy);
        checkIn.setDate(hoy.getDate() + diasDesdeHoy);
        
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkIn.getDate() + nochesMinimas);
        
        const checkInStr = checkIn.toISOString().split('T')[0];
        const checkOutStr = checkOut.toISOString().split('T')[0];
        
        // Validar capacidad en estas fechas
        const { disponible, disponibles } = validarCapacidad(
            roomId, 
            checkInStr, 
            checkOutStr, 
            reservasActivas, 
            capacidadTotal
        );
        
        // Si hay disponibilidad, retornar estas fechas
        if (disponible) {
            const mensaje = diasDesdeHoy === 1 
                ? 'Disponible desde mañana'
                : `Próxima disponibilidad en ${diasDesdeHoy} día${diasDesdeHoy > 1 ? 's' : ''}`;
            
            console.log('✅ Fechas disponibles encontradas:', { checkInStr, checkOutStr, disponibles });
            
            return {
                checkIn: checkInStr,
                checkOut: checkOutStr,
                mensaje,
                disponibles
            };
        }
    }
    
    // Si no encuentra disponibilidad en 90 días, retornar fechas muy lejanas
    console.warn('⚠️ No se encontró disponibilidad en los próximos 90 días');
    const checkIn = new Date(hoy);
    checkIn.setDate(hoy.getDate() + 91);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + nochesMinimas);
    
    return {
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        mensaje: 'Sin disponibilidad próxima (más de 90 días)',
        disponibles: 0
    };
};

/**
 * Función auxiliar para obtener estadísticas de ocupación
 * Útil para debugging y analytics
 * 
 * @param {number} roomId - ID de la habitación
 * @param {Array} reservasActivas - Array de reservas activas
 * @param {number} capacidadTotal - Capacidad total de habitaciones
 * @returns {Object} Estadísticas de ocupación
 */
export const obtenerEstadisticasOcupacion = (roomId, reservasActivas, capacidadTotal = 10) => {
    const reservasRoom = reservasActivas.filter(reserva => 
        reserva.IDHabitacion === roomId && reserva.estado === 'activo'
    );
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Contar reservas activas HOY
    const reservasHoy = reservasRoom.filter(reserva => {
        const reservaInicio = new Date(reserva.fechaIngreso);
        const reservaFin = new Date(reserva.fechaEgreso);
        reservaInicio.setHours(0, 0, 0, 0);
        reservaFin.setHours(0, 0, 0, 0);
        
        return hoy >= reservaInicio && hoy < reservaFin;
    }).length;
    
    return {
        roomId,
        capacidadTotal,
        reservasActivas: reservasRoom.length,
        ocupadasHoy: reservasHoy,
        disponiblesHoy: capacidadTotal - reservasHoy,
        porcentajeOcupacion: ((reservasHoy / capacidadTotal) * 100).toFixed(1)
    };
};