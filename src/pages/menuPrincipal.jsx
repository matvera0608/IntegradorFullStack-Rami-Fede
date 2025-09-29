import React from 'react';

import '../styles/menuPrincipal.css';
function Home() {
  return (
    <>
<div class="container">
            <section class="welcome-section">
                <h2>¡Bienvenido de vuelta!</h2>
                <p>Gestiona tus reservas y pedidos desde tu panel personal</p>
            </section>

            <section class="quick-actions">
                <h3>Acciones Rápidas</h3>
                <div class="row justify-content-center">
                    <div class="col-md-5">
                        <div class="card action-card h-100 border-0 shadow">
                            <div class="card-body text-center">
                                <div class="action-icon primary-icon mx-auto mb-3">
                                    <i class="fas fa-bed"></i>
                                </div>
                                <h4 class="card-title">Reservar Habitación</h4>
                                <p class="card-text">Encuentra la habitación perfecta para tu estadía</p>
                                <button class="btn btn-primary btn-lg">
                                    <i class="fas fa-calendar-plus me-2"></i>Reservar Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-5">
                        <div class="card action-card h-100 border-0 shadow">
                            <div class="card-body text-center">
                                <div class="action-icon secondary-icon mx-auto mb-3">
                                    <i class="fas fa-utensils"></i>
                                </div>
                                <h4 class="card-title">Pedir Buffet</h4>
                                <p class="card-text">Disfruta de nuestro delicioso buffet en tu habitación</p>
                                <button class="btn btn-outline-warning btn-lg" id="buffet-btn">
                                    <i class="fas fa-shopping-cart me-2"></i>Pedir Buffet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="dashboard-grid">
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3>
                            <i class="fas fa-calendar-check me-2"></i>Próximas Reservas
                        </h3>
                        <a href="#" class="view-all">Ver todas</a>
                    </div>
                    
                    <div class="card-content">
                        
                        <div class="reservation-item active">
                            <div class="reservation-info">
                                <h4>Habitación Deluxe #205</h4>
                                <p>25 - 28 Agosto 2025</p>
                                <p>2 huéspedes</p>
                            </div>
                            <div class="reservation-status">
                                <span class="status-badge confirmed">Confirmada</span>
                            </div>
                        </div>
                        
                        <div class="reservation-item">
                            <div class="reservation-info">
                                <h4>Habitación Suite #301</h4>
                                <p>15 - 17 Septiembre 2025</p>
                                <p>2 huéspedes</p>
                            </div>
                            <div class="reservation-status">
                                <span class="status-badge pending">Pendiente</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-card">
                    <div class="card-header">
                        <h3>
                            <i class="fas fa-clipboard-list me-2"></i>Últimos Pedidos
                        </h3>
                        <a href="#" class="view-all">Ver historial</a>
                    </div>
                    
                    <div class="card-content">
                        <div class="order-item">
                            <div class="order-info">
                                <h4>Desayuno Continental</h4>
                                <p>Habitación #205</p>
                                <p class="order-date">22 Agosto 2025 - 08:30</p>
                            </div>
                            <div class="order-status">
                                <span class="status-badge delivered">Entregado</span>
                            </div>
                        </div>
                        
                        <div class="order-item">
                            <div class="order-info">
                                <h4>Menú especial</h4>
                                <p>Habitación #205</p>
                                <p class="order-date">21 Agosto 2025 - 19:00</p>
                            </div>
                            <div class="order-status">
                                <span class="status-badge delivered">Entregado</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-card stats-card">
                    <div class="card-header">
                        <h3>
                            <i class="fas fa-chart-bar me-2"></i>Resumen
                        </h3>
                    </div>
                    <div class="card-content">
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-number">3</div>
                                <div class="stat-label">Reservas Totales</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">8</div>
                                <div class="stat-label">Pedidos Realizados</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">1</div>
                                <div class="stat-label">Reserva Activa</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">★ 4.9</div>
                                <div class="stat-label">Tu Calificación</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    <footer id="contacto" class="contact-footer">
  <div class="container">
    <div class="row">
      <div class="col-12 text-center mb-4">
        <h2 class="section-title text-white">Contáctanos</h2>
        <p class="section-subtitle text-white-50">Estamos aquí para hacer realidad tu estadía perfecta</p>
      </div>
    </div>
    
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10">
        <div class="contact-info">
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="contact-details">
              <h5>Dirección</h5>
              <p>Avenida Paraíso 123 — Playa Dorada, Costa Tropical — CP 12345</p>
            </div>
          </div>
          
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-phone"></i>
            </div>
            <div class="contact-details">
              <h5>Teléfono</h5>
              <p>+1 (555) 123-4567 &nbsp; | &nbsp; +1 (555) 765-4321</p>
            </div>
          </div>
          
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="contact-details">
              <h5>Email</h5>
              <p>info@hotelparadise.com &nbsp; | &nbsp; reservas@hotelparadise.com</p>
            </div>
          </div>
          
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-share-alt"></i>
            </div>
            <div class="contact-details">
              <h5>Síguenos</h5>
              <div class="social-links">
                <a href="#"><i class="fab fa-facebook"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-12 text-center copyright">
        <small class="text-white-50">&copy; 2025 Hotel Paradise. Todos los derechos reservados.</small>
      </div>
    </div>
  </div>
</footer>
</>
  );
}

export default Home;
