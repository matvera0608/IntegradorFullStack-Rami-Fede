import { useState, useRef } from 'react';
import "../styles/Buffet.css"
// Constante: Capacidad total de buffet por tipo
const CAPACIDAD_TOTAL = 10;

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

// Función para validar capacidad
const validarCapacidad = (buffetType, checkIn, checkOut, pedidosActivos, capacidadTotal) => {
    const pedidosEnRango = pedidosActivos.filter(pedido => {
        const pedidoCheckIn = new Date(pedido.fecha);
        const pedidoCheckOut = new Date(pedido.fecha);
        pedidoCheckOut.setDate(pedidoCheckOut.getDate() + 1);
        
        const rangoCheckIn = new Date(checkIn);
        const rangoCheckOut = new Date(checkOut);
        
        return pedido.tipoBuffet === buffetType &&
               pedidoCheckIn < rangoCheckOut && 
               pedidoCheckOut > rangoCheckIn;
    });

    const disponibles = capacidadTotal - pedidosEnRango.length;
    
    return {
        disponible: disponibles > 0,
        ocupadas: pedidosEnRango.length,
        disponibles: disponibles
    };
};

// Función para calcular fechas sugeridas
const calcularFechasSugeridaConCapacidad = (buffetType, pedidosActivos, capacidadTotal) => {
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    const checkInStr = hoy.toISOString().split('T')[0];
    const checkOutStr = mañana.toISOString().split('T')[0];
    
    const validacion = validarCapacidad(buffetType, checkInStr, checkOutStr, pedidosActivos, capacidadTotal);
    
    return {
        checkIn: checkInStr,
        checkOut: checkOutStr,
        mensaje: `Se recomienda esta fecha basada en disponibilidad`,
        disponibles: validacion.disponibles
    };
};

// Función para obtener estadísticas
const obtenerEstadisticasOcupacion = (buffetType, pedidosActivos, capacidadTotal) => {
    const hoy = new Date().toISOString().split('T')[0];
    
    const pedidosHoy = pedidosActivos.filter(pedido => 
        pedido.tipoBuffet === buffetType && pedido.fecha === hoy
    );
    
    const ocupadasHoy = pedidosHoy.length;
    const disponiblesHoy = capacidadTotal - ocupadasHoy;
    const porcentajeOcupacion = Math.round((ocupadasHoy / capacidadTotal) * 100);
    
    return {
        ocupadasHoy,
        disponiblesHoy,
        porcentajeOcupacion
    };
};

// Datos de buffets
const BUFFETS_DATA = [
    {
        id: 1,
        type: 'Continental',
        description: 'Desayuno ligero con frutas, pan tostado y bebidas',
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop',
        features: ['Pan fresco', 'Frutas variadas', 'Bebidas calientes', 'Precio: $15000']
    },
    {
        id: 2,
        type: 'Americano',
        description: 'Desayuno completo con huevos, tocino y acompañamientos',
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
        features: ['Huevos a la carta', 'Carnes frías', 'Tostadas', 'Precio: $25000']
    },
    {
        id: 3,
        type: 'Deluxe',
        description: 'Buffet premium con opciones gourmet y especiales',
        image: 'https://images.unsplash.com/photo-1504674900769-7c1f6319443d?w=400&h=300&fit=crop',
        features: ['Salmón ahumado', 'Quesos importados', 'Postres gourmet', 'Precio: $40000']
    },
    {
        id: 4,
        type: 'Vegetariano',
        description: 'Opciones saludables y nutritivas para vegetarianos',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        features: ['Ensaladas frescas', 'Granolas artesanales', 'Smoothies', 'Precio: $20000']
    },
    {
        id: 5,
        type: 'Vegano',
        description: 'Opciones saludables y nutritivas para vegetarianos',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        features: ['Ensaladas de frutas','Ensaladas de verduras', 'Granolas artesanales', 'Smoothies', 'Precio: $30000']
    }
];

// Mock de pedidos activos
const MOCK_PEDIDOS_ACTIVOS = [
    {
        id: 1,
        tipoBuffet: 'Continental',
        fecha: new Date().toISOString().split('T')[0],
        usuario: 'Juan Pérez'
    }
];

export default function BuffetOrders() {
    const [selectedBuffet, setSelectedBuffet] = useState(null);
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        phone: '',
        guests: '',
        comments: ''
    });
    const [fechasSugeridas, setFechasSugeridas] = useState({ 
        checkIn: '', 
        checkOut: '',
        mensaje: '',
        disponibles: CAPACIDAD_TOTAL
    });
    const [pedidosActivos] = useState(MOCK_PEDIDOS_ACTIVOS);
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);

    // Función para manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSeleccionar = (buffet) => {
        console.log('═══════════════════════════════════════════');
        console.log(`🍽️ Seleccionando buffet: ${buffet.type} (ID: ${buffet.id})`);
        console.log('═══════════════════════════════════════════');
        
        setSelectedBuffet(buffet);
        
        // Calcular fechas sugeridas considerando capacidad
        const fechas = calcularFechasSugeridaConCapacidad(
            buffet.type, 
            pedidosActivos, 
            CAPACIDAD_TOTAL
        );
        
        console.log('📅 Fechas sugeridas calculadas:', fechas);
        
        // Obtener estadísticas de ocupación
        const stats = obtenerEstadisticasOcupacion(buffet.type, pedidosActivos, CAPACIDAD_TOTAL);
        console.log('📊 Estadísticas de ocupación:', stats);
        
        setFechasSugeridas(fechas);
        
        // Pre-rellenar fechas sugeridas
        setFormData(prev => ({
            ...prev,
            checkIn: fechas.checkIn,
            checkOut: fechas.checkOut,
            phone: '',
            guests: '',
            comments: ''
        }));

        // Scroll suave hacia el formulario
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
    };

    // Función para aplicar fechas sugeridas manualmente
    const aplicarFechasSugeridas = () => {
        setFormData(prev => ({
            ...prev,
            checkIn: fechasSugeridas.checkIn,
            checkOut: fechasSugeridas.checkOut
        }));
    };

    const handleOrder = async (e) => {
        e.preventDefault();

        console.log('═══════════════════════════════════════════');
        console.log('🔄 Iniciando proceso de pedido de buffet');
        console.log('═══════════════════════════════════════════');

        // Validar fechas básicas
        if (!formData.checkIn || !formData.checkOut) {
            alert('Por favor, selecciona ambas fechas');
            return;
        }

        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            alert('La fecha no puede ser anterior a hoy');
            return;
        }

        if (checkOutDate <= checkInDate) {
            alert('La fecha de egreso debe ser posterior a la de ingreso');
            return;
        }

        // ✅ VALIDACIÓN CON CAPACIDAD
        const validacion = validarCapacidad(
            selectedBuffet.type,
            formData.checkIn, 
            formData.checkOut, 
            pedidosActivos,
            CAPACIDAD_TOTAL
        );

        console.log('🔍 Resultado de validación de capacidad:', validacion);

        if (!validacion.disponible) {
            alert(
                `❌ No hay disponibilidad en las fechas seleccionadas.\n\n` +
                `📊 Ocupación: ${validacion.ocupadas}/${CAPACIDAD_TOTAL} reservas\n\n` +
                `💡 Te sugerimos usar:\n` +
                `📅 Desde: ${fechasSugeridas.checkIn}\n` +
                `📅 Hasta: ${fechasSugeridas.checkOut}\n` +
                `✅ Disponibles: ${fechasSugeridas.disponibles}/${CAPACIDAD_TOTAL}`
            );
            return;
        }

        // Mostrar confirmación con disponibilidad
        const priceFeature = selectedBuffet.features.find(feature => 
            feature.toLowerCase().includes('precio')
        );
        const precio = priceFeature ? parseInt(priceFeature.match(/\d+/)[0]) : 0;

        const confirmacion = window.confirm(
            `¿Confirmar pedido de buffet?\n\n` +
            `🍽️ Buffet: ${selectedBuffet.type}\n` +
            `📅 Desde: ${formData.checkIn}\n` +
            `📅 Hasta: ${formData.checkOut}\n` +
            `👥 Huéspedes: ${formData.guests}\n` +
            `💰 Precio: $${precio}\n` +
            `✅ Disponibilidad: ${validacion.disponibles}/${CAPACIDAD_TOTAL} cupos libres`
        );

        if (!confirmacion) return;

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const decodedToken = decodeToken(token);
            console.log('🔑 Token decodificado:', decodedToken);

            // Estructura de datos para el pedido
            const pedidoData = {
                tipoBuffet: selectedBuffet.type,
                fechaIngreso: formData.checkIn,
                fechaEgreso: formData.checkOut,
                cantidadHuespedes: formData.guests,
                telefono: formData.phone,
                comentarios: formData.comments,
                precio: precio,
                estado: 'pendiente',
                IDUsuario: decodedToken?.IDUsuario || decodedToken?.id
            };

            console.log('📤 Enviando pedido al backend:', pedidoData);

            const response = await fetch('http://localhost:8080/api/buffet/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(pedidoData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
            }

            console.log('✅ Pedido creado exitosamente:', result);
            alert('¡Pedido de buffet creado exitosamente! 🎉');
            
            // Limpiar formulario
            setSelectedBuffet(null);
            setFormData({
                checkIn: '',
                checkOut: '',
                phone: '',
                guests: '',
                comments: ''
            });

        } catch (error) {
            console.error('❌ Error al crear pedido:', error);
            alert('Error al crear el pedido: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700">
            <style>{`
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                .action-card::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: linear-gradient(90deg, #667eea, #764ba2);
                }
            `}</style>

            {/* HERO SECTION */}
            <section className="py-16 text-center text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Pide nuestro Delicioso Buffet</h1>
                    <p className="text-xl opacity-90">Elige el buffet perfecto y disfruta en tu habitación</p>
                </div>
            </section>

            {/* BUFFETS GRID SECTION */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {BUFFETS_DATA.map((buffet) => {
                            const stats = obtenerEstadisticasOcupacion(buffet.type, pedidosActivos, CAPACIDAD_TOTAL);
                            
                            return (
                                <div key={buffet.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                    {/* Imagen */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={buffet.image} 
                                            alt={`Buffet ${buffet.type}`}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className={`absolute top-4 right-4 px-3 py-2 rounded-full text-xs font-semibold ${
                                            stats.disponiblesHoy === 0 
                                                ? 'bg-red-500 text-white' 
                                                : 'bg-green-500 text-white'
                                        }`}>
                                            {stats.disponiblesHoy === 0 
                                                ? '❌ Lleno hoy' 
                                                : `✅ ${stats.disponiblesHoy}/${CAPACIDAD_TOTAL} disponibles`
                                            }
                                        </div>
                                    </div>
                                    
                                    {/* Contenido */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{buffet.type}</h3>
                                        <p className="text-gray-600 mb-4 text-sm">{buffet.description}</p>
                                        
                                        {/* Features */}
                                        <ul className="mb-4 space-y-2">
                                            {buffet.features.map((feature, index) => (
                                                <li key={index} className="text-sm text-gray-700">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        {/* Ocupación */}
                                        {stats.ocupadasHoy > 0 && (
                                            <div className="text-center mb-4 p-3 bg-gray-100 rounded-lg">
                                                <p className="text-sm text-gray-700">
                                                    📊 Ocupación hoy: {stats.porcentajeOcupacion}%
                                                </p>
                                            </div>
                                        )}
                                        
                                        <button 
                                            onClick={() => handleSeleccionar(buffet)}
                                            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold hover:shadow-lg"
                                        >
                                            🍽️ Seleccionar Buffet
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FORMULARIO DE PEDIDO */}
            <section 
                ref={formRef}
                className={`py-12 transition-all duration-300 ${selectedBuffet ? 'visible' : 'hidden'}`}
            >
                <div className="container mx-auto px-4">
                    {selectedBuffet && (
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                🍽️ Pedir Buffet {selectedBuffet.type}
                            </h2>
                            
                            {/* Alert */}
                            <div className={`p-6 rounded-lg mb-6 border ${
                                fechasSugeridas.disponibles === 0 
                                    ? 'bg-red-50 border-red-300' 
                                    : 'bg-blue-50 border-blue-300'
                            }`}>
                                <p className="font-semibold mb-2">
                                    📅 Fechas sugeridas: {fechasSugeridas.checkIn} a {fechasSugeridas.checkOut}
                                </p>
                                <p className="text-sm mb-2">{fechasSugeridas.mensaje}</p>
                                <p className="font-bold text-lg">
                                    ✅ Disponibilidad: {fechasSugeridas.disponibles}/{CAPACIDAD_TOTAL} cupos
                                </p>
                            </div>
                            
                            <form onSubmit={handleOrder} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Fecha de Ingreso</label>
                                        <input 
                                            type="date" 
                                            name="checkIn"
                                            value={formData.checkIn}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                                            min={new Date().toISOString().split('T')[0]}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Fecha de Egreso</label>
                                        <input 
                                            type="date" 
                                            name="checkOut"
                                            value={formData.checkOut}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                                            min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                                            placeholder="+54 9 11 1234-5678"
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Cantidad de Huéspedes</label>
                                        <select 
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600" 
                                            required
                                        >
                                            <option value="">Selecciona...</option>
                                            <option value="1">1 Huésped</option>
                                            <option value="2">2 Huéspedes</option>
                                            <option value="3">3 Huéspedes</option>
                                            <option value="4">4 Huéspedes</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Comentarios Adicionales</label>
                                    <textarea 
                                        name="comments"
                                        value={formData.comments}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                                        placeholder="Alergias, restricciones dietéticas, solicitudes especiales..."
                                        rows="4"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 hover:shadow-lg"
                                >
                                    {loading ? '⏳ Procesando...' : '✅ Confirmar Pedido'}
                                </button>
                                
                                <button 
                                    type="button"
                                    onClick={aplicarFechasSugeridas}
                                    className="w-full px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-all duration-300 hover:shadow-lg"
                                >
                                    🔄 Restaurar Fechas Sugeridas ({fechasSugeridas.checkIn} - {fechasSugeridas.checkOut})
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}