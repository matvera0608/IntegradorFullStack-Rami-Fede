import React from 'react';
import '../styles/menuPrincipal.css';
import { useNavigate } from 'react-router-dom';
function menuPrincipal() {
  const navigate = useNavigate();
  const handleReservar = () => {
    navigate('/reservations');
  }
  return (
    <>
      <div className="menu-container">
        <section className="menu-welcome-section">
          <h2>¡Bienvenido de vuelta!</h2>
          <p>Gestiona tus reservas y pedidos desde tu panel personal</p>
        </section>

        <section className="menu-quick-actions">
          <h3>Acciones Rápidas</h3>
          <div className="menu-row menu-justify-content-center">
            <div className="menu-col-md-5">
              <div className="menu-card menu-action-card menu-h-100 menu-border-0 menu-shadow">
                <div className="menu-card-body menu-text-center">
                  <div className="menu-action-icon menu-primary-icon menu-mx-auto menu-mb-3">
                    <i className="fas fa-bed"></i>
                  </div>
                  <h4 className="menu-card-title">Reservar Habitación</h4>
                  <p className="menu-card-text">Encuentra la habitación perfecta para tu estadía</p>
                  <button className="menu-btn menu-btn-primary menu-btn-lg" onClick={() => handleReservar()}>
                    <i className="fas fa-calendar-plus menu-me-2"></i>Reservar Ahora
                  </button>
                </div>
              </div>
            </div>
            
            <div className="menu-col-md-5">
              <div className="menu-card menu-action-card menu-h-100 menu-border-0 menu-shadow">
                <div className="menu-card-body menu-text-center">
                  <div className="menu-action-icon menu-secondary-icon menu-mx-auto menu-mb-3">
                    <i className="fas fa-utensils"></i>
                  </div>
                  <h4 className="menu-card-title">Pedir Buffet</h4>
                  <p className="menu-card-text">Disfruta de nuestro delicioso buffet en tu habitación</p>
                  <button className="menu-btn menu-btn-outline-warning menu-btn-lg" id="menu-buffet-btn">
                    <i className="fas fa-shopping-cart menu-me-2"></i>Pedir Buffet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="menu-dashboard-grid">
          <div className="menu-dashboard-card">
            <div className="menu-card-header">
              <h3>
                <i className="fas fa-calendar-check menu-me-2"></i>Próximas Reservas
              </h3>
              <a href="#" className="menu-view-all">Ver todas</a>
            </div>
            
            <div className="menu-card-content">
              <div className="menu-reservation-item menu-active">
                <div className="menu-reservation-info">
                  <h4>Habitación Deluxe #205</h4>
                  <p>25 - 28 Agosto 2025</p>
                  <p>2 huéspedes</p>
                </div>
                <div className="menu-reservation-status">
                  <span className="menu-status-badge menu-confirmed">Confirmada</span>
                </div>
              </div>
              
              <div className="menu-reservation-item">
                <div className="menu-reservation-info">
                  <h4>Habitación Suite #301</h4>
                  <p>15 - 17 Septiembre 2025</p>
                  <p>2 huéspedes</p>
                </div>
                <div className="menu-reservation-status">
                  <span className="menu-status-badge menu-pending">Pendiente</span>
                </div>
              </div>
            </div>
          </div>

          <div className="menu-dashboard-card">
            <div className="menu-card-header">
              <h3>
                <i className="fas fa-clipboard-list menu-me-2"></i>Últimos Pedidos
              </h3>
              <a href="#" className="menu-view-all">Ver historial</a>
            </div>
            
            <div className="menu-card-content">
              <div className="menu-order-item">
                <div className="menu-order-info">
                  <h4>Desayuno Continental</h4>
                  <p>Habitación #205</p>
                  <p className="menu-order-date">22 Agosto 2025 - 08:30</p>
                </div>
                <div className="menu-order-status">
                  <span className="menu-status-badge menu-delivered">Entregado</span>
                </div>
              </div>
              
              <div className="menu-order-item">
                <div className="menu-order-info">
                  <h4>Menú especial</h4>
                  <p>Habitación #205</p>
                  <p className="menu-order-date">21 Agosto 2025 - 19:00</p>
                </div>
                <div className="menu-order-status">
                  <span className="menu-status-badge menu-delivered">Entregado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="menu-dashboard-card menu-stats-card">
            <div className="menu-card-header">
              <h3>
                <i className="fas fa-chart-bar menu-me-2"></i>Resumen
              </h3>
            </div>
            <div className="menu-card-content">
              <div className="menu-stats-grid">
                <div className="menu-stat-item">
                  <div className="menu-stat-number">3</div>
                  <div className="menu-stat-label">Reservas Totales</div>
                </div>
                <div className="menu-stat-item">
                  <div className="menu-stat-number">8</div>
                  <div className="menu-stat-label">Pedidos Realizados</div>
                </div>
                <div className="menu-stat-item">
                  <div className="menu-stat-number">1</div>
                  <div className="menu-stat-label">Reserva Activa</div>
                </div>
                <div className="menu-stat-item">
                  <div className="menu-stat-number">★ 4.9</div>
                  <div className="menu-stat-label">Tu Calificación</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer id="menu-contacto" className="menu-contact-footer">
        <div className="menu-container">
          <div className="menu-row">
            <div className="menu-col-12 menu-text-center menu-mb-4">
              <h2 className="menu-section-title menu-text-white">Contáctanos</h2>
              <p className="menu-section-subtitle menu-text-white-50">Estamos aquí para hacer realidad tu estadía perfecta</p>
            </div>
          </div>
          
          <div className="menu-row menu-justify-content-center">
            <div className="menu-col-lg-8 menu-col-md-10">
              <div className="menu-contact-info">
                <div className="menu-contact-item">
                  <div className="menu-contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="menu-contact-details">
                    <h5>Dirección</h5>
                    <p>Avenida Paraíso 123 — Playa Dorada, Costa Tropical — CP 12345</p>
                  </div>
                </div>
                
                <div className="menu-contact-item">
                  <div className="menu-contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="menu-contact-details">
                    <h5>Teléfono</h5>
                    <p>+1 (555) 123-4567 &nbsp; | &nbsp; +1 (555) 765-4321</p>
                  </div>
                </div>
                
                <div className="menu-contact-item">
                  <div className="menu-contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="menu-contact-details">
                    <h5>Email</h5>
                    <p>info@hotelparadise.com &nbsp; | &nbsp; reservas@hotelparadise.com</p>
                  </div>
                </div>
                
                <div className="menu-contact-item">
                  <div className="menu-contact-icon">
                    <i className="fas fa-share-alt"></i>
                  </div>
                  <div className="menu-contact-details">
                    <h5>Síguenos</h5>
                    <div className="menu-social-links">
                      <a href="#"><i className="fab fa-facebook"></i></a>
                      <a href="#"><i className="fab fa-instagram"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                      <a href="#"><i className="fab fa-youtube"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="menu-row">
            <div className="menu-col-12 menu-text-center menu-copyright">
              <small className="menu-text-white-50">&copy; 2025 Hotel Paradise. Todos los derechos reservados.</small>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default menuPrincipal;