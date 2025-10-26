import { useState, useEffect } from 'react';
import '../styles/UserOrders.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('todos');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [selectedFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/orders/order', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar pedidos');
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (selectedFilter === 'todos') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.estado === selectedFilter));
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'pendiente': { 
        icon: '⏰', 
        badgeClass: 'badge-pendiente',
        label: 'Pendiente'
      },
      'en preparación': { 
        icon: '👨‍🍳', 
        badgeClass: 'badge-preparacion',
        label: 'En Preparación'
      },
      'en camino': { 
        icon: '🚚', 
        badgeClass: 'badge-camino',
        label: 'En Camino'
      },
      'entregado': { 
        icon: '✅', 
        badgeClass: 'badge-entregado',
        label: 'Entregado'
      },
      'cancelado': { 
        icon: '❌', 
        badgeClass: 'badge-cancelado',
        label: 'Cancelado'
      }
    };
    return configs[status] || configs['pendiente'];
  };

  const getOrderCountByStatus = (status) => {
    if (status === 'todos') return orders.length;
    return orders.filter(order => order.estado === status).length;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (detalles) => {
    return detalles.reduce((sum, det) => sum + parseFloat(det.subtotal), 0).toFixed(2);
  };

  const filterOptions = [
    { value: 'todos', label: 'Todos', icon: '📋' },
    { value: 'pendiente', label: 'Pendiente', icon: '⏰' },
    { value: 'en preparación', label: 'En Preparación', icon: '👨‍🍳' },
    { value: 'en camino', label: 'En Camino', icon: '🚚' },
    { value: 'entregado', label: 'Entregado', icon: '✅' },
    { value: 'cancelado', label: 'Cancelado', icon: '❌' }
  ];

  if (loading) {
    return (
      <div className="user-orders-loading">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <p className="loading-text">Cargando tus pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-orders-error">
        <div className="error-container">
          <div className="error-icon-wrapper">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h3 className="error-title">¡Oops! Algo salió mal</h3>
          <p className="error-message">{error}</p>
          <button 
            onClick={fetchOrders}
            className="btn btn-primary btn-retry"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="user-orders-empty">
        <div className="empty-illustration">
          <i className="bi bi-bag-x"></i>
        </div>
        <h3 className="empty-title">No hay pedidos aún</h3>
        <p className="empty-subtitle">Todavía no has realizado ningún pedido</p>
        <div className="empty-suggestion">
          <i className="bi bi-lightbulb me-2"></i>
          ¡Visita nuestro buffet y haz tu primer pedido!
        </div>
      </div>
    );
  }

  return (
    <div className="user-orders-container">
      <div className="container py-4">
        <div className="user-orders-header">
          <div className="header-content">
            <h1 className="header-title">
              <i className="bi bi-receipt me-2"></i>
              Mis Pedidos
            </h1>
            <p className="header-subtitle">Historial y estado de tus pedidos</p>
          </div>
          <div className="header-badge">
            <span className="total-orders">{orders.length}</span>
            <span className="badge-label">Pedidos</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-container">
          <div className="filters-wrapper">
            {filterOptions.map((option) => {
              const count = getOrderCountByStatus(option.value);
              return (
                <button
                  key={option.value}
                  className={`filter-btn ${selectedFilter === option.value ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(option.value)}
                >
                  <span className="filter-icon">{option.icon}</span>
                  <span className="filter-label">{option.label}</span>
                  <span className="filter-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-results-container">
            <div className="no-results-icon">
              <i className="bi bi-search"></i>
            </div>
            <h4 className="no-results-title">No hay pedidos con este estado</h4>
            <p className="no-results-text">Intenta seleccionar otro filtro</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.estado);
              
              return (
                <div key={order.ID} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <div className="order-number-badge">
                        <i className="bi bi-hash"></i>
                        {order.ID}
                      </div>
                      <h5 className="order-date">
                        <i className="bi bi-calendar-check me-2"></i>
                        {formatDate(order.fechaPedido)}
                      </h5>
                      <div className="order-room">
                        <i className="bi bi-door-open me-1"></i>
                        Habitación <strong>{order.IDHabitacion}</strong>
                      </div>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${statusConfig.badgeClass}`}>
                        <span className="status-icon">{statusConfig.icon}</span>
                        <span className="status-label">{statusConfig.label}</span>
                      </span>
                    </div>
                  </div>

                  <div className="order-body">
                    <div className="products-header">
                      <i className="bi bi-basket2 me-2"></i>
                      <span>Productos Pedidos</span>
                    </div>
                    
                    <div className="products-list">
                      {order.detalles.map((detalle, index) => (
                        <div key={detalle.IdDetalle} className="product-item" style={{'--item-index': index}}>
                          <div className="product-icon">
                            <i className="bi bi-basket-fill"></i>
                          </div>
                          <div className="product-details">
                            <div className="product-header-row">
                              <h6 className="product-name">
                                {detalle.producto?.nombre || 'Producto no disponible'}
                              </h6>
                              <div className="quantity-badge">{detalle.cantidad}x</div>
                            </div>
                            <p className="product-description">
                              {detalle.producto?.descripcion || ''}
                            </p>
                            <div className="product-meta">
                              <span className="unit-price">
                                <i className="bi bi-tag me-1"></i>
                                ${parseFloat(detalle.producto?.precio || 0).toFixed(2)} c/u
                              </span>
                            </div>
                          </div>
                          <div className="product-price-wrapper">
                            <div className="product-total">
                              ${parseFloat(detalle.subtotal).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-total-container">
                        <span className="total-label">Total del pedido</span>
                        <span className="total-amount">${calculateTotal(order.detalles)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;