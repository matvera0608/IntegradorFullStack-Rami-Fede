import { useState, useEffect } from 'react';
import '../styles/Buffet.css';
import { obtenerHabitacionReservaActiva } from '../utils/ReserveActive';

const BuffetSelector = () => {
  // Estados
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('buffet');
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState(null);

  // Categorías
  const categorias = [
    { id: 'bebidas', nombre: 'Bebidas', icon: '🥤' },
    { id: 'buffet', nombre: 'Platos Principales', icon: '🍽️' },
    { id: 'postres', nombre: 'Postres', icon: '🍰' }
  ];

  // Cargar productos desde la API
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargandoProductos(true);
        const response = await fetch('http://localhost:8080/api/buffet/catalog'); // Ajusta la URL según tu API
        
        if (!response.ok) {
          throw new Error('Error al cargar el catálogo');
        }

        const data = await response.json();
        
        // Mapear los datos de la API al formato que usa el componente
        const productosFormateados = data.catalog.map(item => ({
          id: item.ID,
          nombre: item.nombre,
          descripcion: item.descripcion,
          categoria: item.categoria,
          disponibilidad: item.disponibilidad,
          precio: parseFloat(item.precio), // Convertir string a número
          img: item.img
        }));

        setProductos(productosFormateados);
        setErrorProductos(null);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setErrorProductos(error.message);
      } finally {
        setCargandoProductos(false);
      }
    };

    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter(
    p => p.categoria === categoriaSeleccionada && p.disponibilidad === 1
  );

  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const modificarCantidad = (id, cambio) => {
    setCarrito(carrito.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + cambio;
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  const confirmarOrden = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión.');
      }

      // Obtener la habitación de la reserva activa más reciente
      const resultadoReserva = await obtenerHabitacionReservaActiva(token);
      
      if (!resultadoReserva.tieneReservaActiva) {
        throw new Error('No tienes una reserva activa para realizar pedidos');
      }

      const IDHabitacion = resultadoReserva.habitacionId;
      const fechaPedido = new Date().toISOString().split('T')[0];
      
      const ordenData = {
        IDHabitacion: IDHabitacion,
        fechaPedido: fechaPedido,
        estado: 'pendiente',
        items: carrito.map(item => ({
          IDBuffet: item.id,
          cantidad: item.cantidad,
          subtotal: parseFloat((item.precio * item.cantidad).toFixed(2))
        }))
      };

      console.log('Enviando orden:', ordenData);

      const response = await fetch('http://localhost:8080/api/orders/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ordenData),
      });

      const contentType = response.headers.get("content-type");
      let resultado;
      
      if (contentType && contentType.includes("application/json")) {
        resultado = await response.json();
      } else {
        const text = await response.text();
        console.error('Respuesta no JSON:', text);
        throw new Error('El servidor no respondió con JSON válido');
      }

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(`Datos inválidos: ${resultado.message}`);
        }
        if (response.status === 401) {
          throw new Error('No autorizado. Token inválido.');
        }
        throw new Error(resultado.message || 'Error del servidor');
      }

      mostrarConfirmacionExitosa(resultado.orderId);
      
      setCarrito([]);
      setMostrarCarrito(false);

    } catch (error) {
      console.error('Error completo:', error);
      manejarErrorConfirmacion(error.message);
    } finally {
      setLoading(false);
    }
  };

  const mostrarConfirmacionExitosa = (orderId) => {
    alert(`
      ✅ ¡Orden confirmada exitosamente!
      
      Número de pedido: #${orderId}
      Total: $${calcularTotal().toFixed(2)}
      Estado: Pendiente
      
      Su pedido será entregado en su habitación.
      Puede seguir el estado de su pedido en la sección "Mis Pedidos".
    `);
  };

  const manejarErrorConfirmacion = (mensajeError) => {
    alert(`❌ Error al confirmar la orden: ${mensajeError}`);
  };

  // Mostrar estado de carga
  if (cargandoProductos) {
    return (
      <div className="buffet-container">
        <div className="buffet-header">
          <div className="buffet-header-content">
            <div className="buffet-header-title">
              <h1>Servicio a la Habitación</h1>
              <p>Cargando productos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si falla la carga
  if (errorProductos) {
    return (
      <div className="buffet-container">
        <div className="buffet-header">
          <div className="buffet-header-content">
            <div className="buffet-header-title">
              <h1>Servicio a la Habitación</h1>
              <p style={{ color: 'red' }}>Error: {errorProductos}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="buffet-container">
      {/* Header */}
      <div className="buffet-header">
        <div className="buffet-header-content">
          <div className="buffet-header-title">
            <h1>Servicio a la Habitación</h1>
            <p>Seleccione sus productos del buffet</p>
          </div>
          <button
            onClick={() => setMostrarCarrito(!mostrarCarrito)}
            className="buffet-cart-btn"
          >
            <i className="bi bi-cart3"></i>
            <span>Carrito</span>
            {cantidadTotal > 0 && (
              <span className="buffet-cart-badge">
                {cantidadTotal}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="buffet-main">
        <div className="buffet-layout">
          {/* Panel Principal */}
          <div className="buffet-products-section">
            {/* Selector de Categorías */}
            <div className="buffet-categories">
              <h2>Categorías</h2>
              <div className="buffet-categories-grid">
                {categorias.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaSeleccionada(cat.id)}
                    className={`buffet-category-btn ${categoriaSeleccionada === cat.id ? 'active' : ''}`}
                  >
                    <div className="buffet-category-icon">{cat.icon}</div>
                    <div className="buffet-category-name">
                      {cat.nombre}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="buffet-products-grid">
              {productosFiltrados.map(producto => (
                <div
                  key={producto.id}
                  className="buffet-product-card"
                >
                  <div className="buffet-product-image">
                    <img
                      src={producto.img}
                      alt={producto.nombre}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="buffet-product-info">
                    <h3 className="buffet-product-name">{producto.nombre}</h3>
                    <p className="buffet-product-description">{producto.descripcion}</p>
                    <div className="buffet-product-footer">
                      <span className="buffet-product-price">
                        ${producto.precio.toFixed(2)}
                      </span>
                      <button
                        onClick={() => agregarAlCarrito(producto)}
                        className="buffet-add-btn"
                      >
                        <i className="bi bi-plus-lg"></i>
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel del Carrito (visible en desktop) */}
          {mostrarCarrito && (
            <div className="buffet-cart-panel">
              <div className="buffet-cart-content">
                <div className="buffet-cart-header">
                  <h2>Mi Orden</h2>
                  <button
                    onClick={() => setMostrarCarrito(false)}
                    className="buffet-cart-close hide-desktop"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                {carrito.length === 0 ? (
                  <div className="buffet-cart-empty">
                    <i className="bi bi-cart3"></i>
                    <p>Tu carrito está vacío</p>
                  </div>
                ) : (
                  <>
                    <div className="buffet-cart-items">
                      {carrito.map(item => (
                        <div key={item.id} className="buffet-cart-item">
                          <img
                            src={item.img}
                            alt={item.nombre}
                            className="buffet-cart-item-image"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23e0e0e0" width="64" height="64"/%3E%3C/svg%3E';
                            }}
                          />
                          <div className="buffet-cart-item-info">
                            <h4 className="buffet-cart-item-name">{item.nombre}</h4>
                            <p className="buffet-cart-item-price">${item.precio.toFixed(2)}</p>
                          </div>
                          <div className="buffet-cart-item-controls">
                            <button
                              onClick={() => modificarCantidad(item.id, -1)}
                              className="buffet-quantity-btn"
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="buffet-quantity-display">{item.cantidad}</span>
                            <button
                              onClick={() => modificarCantidad(item.id, 1)}
                              className="buffet-quantity-btn"
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                            <button
                              onClick={() => eliminarDelCarrito(item.id)}
                              className="buffet-delete-btn"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="buffet-cart-footer">
                      <div className="buffet-cart-total">
                        <span className="buffet-cart-total-label">Total:</span>
                        <span className="buffet-cart-total-amount">
                          ${calcularTotal().toFixed(2)}
                        </span>
                      </div>
                      <button 
                        onClick={confirmarOrden}
                        className="buffet-confirm-btn"
                        disabled={carrito.length === 0 || loading}
                      >
                        {loading ? (
                          <>
                            <i className="bi bi-arrow-repeat spin"></i>
                            Procesando...
                          </>
                        ) : (
                          <>
                            Confirmar Orden (${calcularTotal().toFixed(2)})
                            <i className="bi bi-chevron-right"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Carrito Modal (móvil) */}
      {mostrarCarrito && (
        <div className="buffet-cart-modal-overlay" onClick={() => setMostrarCarrito(false)}>
          <div className="buffet-cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="buffet-cart-header">
              <h2>Mi Orden</h2>
              <button
                onClick={() => setMostrarCarrito(false)}
                className="buffet-cart-close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {carrito.length === 0 ? (
              <div className="buffet-cart-empty">
                <i className="bi bi-cart3"></i>
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="buffet-cart-items">
                  {carrito.map(item => (
                    <div key={item.id} className="buffet-cart-item">
                      <img
                        src={item.img}
                        alt={item.nombre}
                        className="buffet-cart-item-image"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23e0e0e0" width="64" height="64"/%3E%3C/svg%3E';
                        }}
                      />
                      <div className="buffet-cart-item-info">
                        <h4 className="buffet-cart-item-name">{item.nombre}</h4>
                        <p className="buffet-cart-item-price">${item.precio.toFixed(2)}</p>
                      </div>
                      <div className="buffet-cart-item-controls">
                        <button
                          onClick={() => modificarCantidad(item.id, -1)}
                          className="buffet-quantity-btn"
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="buffet-quantity-display">{item.cantidad}</span>
                        <button
                          onClick={() => modificarCantidad(item.id, 1)}
                          className="buffet-quantity-btn"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                        <button
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="buffet-delete-btn"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="buffet-cart-footer">
                  <div className="buffet-cart-total">
                    <span className="buffet-cart-total-label">Total:</span>
                    <span className="buffet-cart-total-amount">
                      ${calcularTotal().toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={confirmarOrden}
                    className="buffet-confirm-btn"
                    disabled={carrito.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <i className="bi bi-arrow-repeat spin"></i>
                        Procesando...
                      </>
                    ) : (
                      <>
                        Confirmar Orden (${calcularTotal().toFixed(2)})
                        <i className="bi bi-chevron-right"></i>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuffetSelector;