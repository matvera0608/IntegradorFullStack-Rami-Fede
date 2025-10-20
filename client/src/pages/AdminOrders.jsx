import { useState, useEffect } from 'react';
import '../styles/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/orders/all', {
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: newStatus })
      });

      if (!response.ok) throw new Error('Error al actualizar estado');

      // Actualizar el estado localmente
      setOrders(orders.map(order => 
        order.ID === orderId ? { ...order, estado: newStatus } : order
      ));

      setExpandedOrder(null);
      alert('Estado actualizado correctamente');
    } catch (err) {
      alert('Error al actualizar el estado: ' + err.message);
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

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="admin-orders-loading">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-error">
        <div className="error-container">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <h3>Error al cargar pedidos</h3>
          <p>{error}</p>
          <button onClick={fetchAllOrders} className="btn btn-light">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <div className="container py-4">
        <div className="admin-orders-header">
          <div>
            <h1>
              <i className="bi bi-clipboard-check me-2"></i>
              Gestión de Pedidos
            </h1>
            <p>Administra y actualiza el estado de los pedidos</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orders.filter(o => o.estado === 'pendiente').length}</span>
              <span className="stat-label">Pendientes</span>
            </div>
          </div>
        </div>

        <div className="orders-grid">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.estado);
            const isExpanded = expandedOrder === order.ID;
            
            return (
              <div key={order.ID} className={`admin-order-card ${isExpanded ? 'expanded' : ''}`}
              >
                <div className="order-card-header">
                  <div className="order-info-section">
                    <div className="order-number">
                      <i className="bi bi-receipt"></i>
                      Pedido #{order.ID}
                    </div>
                    <div className="order-details-row">
                      <span>
                        <i className="bi bi-person-circle me-1"></i>
                        Usuario: <strong>{order.nombreUsuario}</strong>
                      </span>
                      <span>
                        <i className="bi bi-door-open me-1"></i>
                        Habitación: <strong>{order.numeroHabitacion}</strong>
                      </span>
                    </div>

                    <div className="order-date">
                      <i className="bi bi-calendar3 me-1"></i>
                      {formatDate(order.fechaPedido)}
                    </div>
                  </div>
                  <div className={`status-badge-admin ${statusConfig.badgeClass}`}>
                    <span className="status-icon">{statusConfig.icon}</span>
                    <span>{statusConfig.label}</span>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="summary-item">
                    <i className="bi bi-basket3"></i>
                    <span>{order.detalles?.length || 0} productos</span>
                  </div>
                  <div className="summary-item total">
                    <i className="bi bi-cash-coin"></i>
                    <span>${calculateTotal(order.detalles || [])}</span>
                  </div>
                </div>

                <div className="order-actions">
                  {order.estado === 'pendiente' && (
                    <>
                      <button 
                        className="action-btn btn-prepare"
                        onClick={() => toggleOrderExpansion(order.ID)}
                      >
                        <i className="bi bi-gear me-1"></i>
                        Gestionar
                      </button>
                      <button 
                        className="action-btn btn-cancel"
                        onClick={() => {
                          if (confirm('¿Cancelar este pedido?')) {
                            updateOrderStatus(order.ID, 'cancelado');
                          }
                        }}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Cancelar
                      </button>
                    </>
                  )}
                  {order.estado !== 'pendiente' && order.estado !== 'entregado' && order.estado !== 'cancelado' && (
                    <button 
                      className="action-btn btn-continue"
                      onClick={() => toggleOrderExpansion(order.ID)}
                    >
                      <i className="bi bi-arrow-right-circle me-1"></i>
                      Continuar
                    </button>
                  )}
                  {(order.estado === 'entregado' || order.estado === 'cancelado') && (
                    <div className="status-final">
                      Estado final: <strong>{statusConfig.label}</strong>
                    </div>
                  )}
                </div>

                {isExpanded && order.estado !== 'entregado' && order.estado !== 'cancelado' && (
                  <div className="status-manager">
                    <div className="manager-header">
                      <h4>
                        <i className="bi bi-sliders me-2"></i>
                        Cambiar Estado del Pedido
                      </h4>
                      <button 
                        className="close-btn"
                        onClick={() => setExpandedOrder(null)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                    
                    <div className="status-options">
                      {order.estado === 'pendiente' && (
                        <button
                          className="status-option option-preparacion"
                          onClick={() => {
                            if (confirm('¿Marcar como "En Preparación"?')) {
                              updateOrderStatus(order.ID, 'en preparación');
                            }
                          }}
                        >
                          <div className="option-icon">👨‍🍳</div>
                          <div className="option-content">
                            <strong>En Preparación</strong>
                            <small>El pedido está siendo preparado</small>
                          </div>
                          <i className="bi bi-arrow-right"></i>
                        </button>
                      )}

                      {order.estado === 'en preparación' && (
                        <button
                          className="status-option option-camino"
                          onClick={() => {
                            if (confirm('¿Marcar como "En Camino"?')) {
                              updateOrderStatus(order.ID, 'en camino');
                            }
                          }}
                        >
                          <div className="option-icon">🚚</div>
                          <div className="option-content">
                            <strong>En Camino</strong>
                            <small>El pedido va hacia la habitación</small>
                          </div>
                          <i className="bi bi-arrow-right"></i>
                        </button>
                      )}

                      {order.estado === 'en camino' && (
                        <button
                          className="status-option option-entregado"
                          onClick={() => {
                            if (confirm('¿Marcar como "Entregado"?')) {
                              updateOrderStatus(order.ID, 'entregado');
                            }
                          }}
                        >
                          <div className="option-icon">✅</div>
                          <div className="option-content">
                            <strong>Entregado</strong>
                            <small>El pedido fue entregado exitosamente</small>
                          </div>
                          <i className="bi bi-check-circle"></i>
                        </button>
                      )}
                    </div>

                    <div className="products-detail">
                      <h5>Detalles del Pedido</h5>
                      {order.detalles?.map((detalle) => (
                        <div key={detalle.IdDetalle} className="detail-item">
                          <div className="detail-info">
                            <strong>{detalle.producto?.nombre || 'Producto'}</strong>
                            <small>Cantidad: {detalle.cantidad}</small>
                          </div>
                          <div className="detail-price">
                            ${parseFloat(detalle.subtotal).toFixed(2)}
                          </div>
                        </div>
                      ))}
                      <div className="detail-total">
                        <strong>Total:</strong>
                        <strong>${calculateTotal(order.detalles || [])}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;