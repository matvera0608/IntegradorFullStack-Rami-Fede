import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <>
      {/* Sección de Servicios */}
      <section id="servicios" className="home-services-section">
        <div className="home-container">
          <div className="home-section-header">
            <div className="home-col-12 home-text-center home-mb-5">
              <h2 className="home-section-title">¿Por qué elegir Hotel home?</h2>
              <p className="home-section-subtitle">Descubre las características que nos hacen únicos</p>
            </div>
          </div>
          
          <div className="home-services-grid">
            <div className="home-service-card">
              <div className="home-service-icon home-luxury-icon">
                <i className="fas fa-crown"></i>
              </div>
              <h4>Lujo Premium</h4>
              <p>Habitaciones y suites diseñadas con los más altos estándares de elegancia y confort.</p>
            </div>
            
            <div className="home-service-card">
              <div className="home-service-icon home-location-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h4>Ubicación Privilegiada</h4>
              <p>Ubicado en primera línea de playa con vistas espectaculares al océano y montañas.</p>
            </div>
            
            <div className="home-service-card">
              <div className="home-service-icon home-dining-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h4>Gastronomía Excepcional</h4>
              <p>Restaurantes gourmet con chefs internacionales y servicio de habitación 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Galería */}
      <section id="galeria" className="home-gallery-section">
        <div className="home-container">
          <div className="home-row">
            <div className="home-col-12 home-text-center home-mb-5">
              <h2 className="home-section-title home-text-white">Nuestras Instalaciones</h2>
              <p className="home-section-subtitle home-text-white-50">Un vistazo a la experiencia que te espera</p>
            </div>
          </div>
          
          <div className="home-row home-g-4">
            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-gallery-item">
                <div className="home-gallery-image">
                  <img src="/src/img/Vista.jpg" alt="Suite Presidential" />
                </div>
                <div className="home-gallery-overlay">
                  <h5>Suite Presidencial</h5>
                  <p>Vista panorámica al océano</p>
                </div>
              </div>
            </div>
            
            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-gallery-item">
                <div className="home-gallery-image">
                  <img src="/src/img/piscina.jpg" alt="Piscina" />
                </div>
                <div className="home-gallery-overlay">
                  <h5>Piscina</h5>
                  <p>Relájate con vistas espectaculares</p>
                </div>
              </div>
            </div>
            
            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-gallery-item">
                <div className="home-gallery-image">
                  <img src="src/img/plato.png" alt="Restaurante Gourmet" />
                </div>
                <div className="home-gallery-overlay">
                  <h5>Restaurante Gourmet</h5>
                  <p>Experiencia culinaria única</p>
                </div>
              </div>
            </div>
            
            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-gallery-item">
                <div className="home-gallery-image">
                  <img src="/src/img/ServicioCuarto.jpeg" alt="Servicio al Cuarto" />
                </div>
                <div className="home-gallery-overlay">
                  <h5>Servicio al Cuarto de Lujo</h5>
                  <p>Disponible 24 hs</p>
                </div>
              </div>
            </div>
            
            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-gallery-item">
                <div className="home-gallery-image">
                  <img src="src/img/imgPlaya.png" alt="Playa Privada" />
                </div>
                <div className="home-gallery-overlay">
                  <h5>Playa Privada</h5>
                  <p>Arena blanca y aguas cristalinas</p>
                </div>
              </div>
            </div>
            
            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-gallery-item">
                <div className="home-gallery-image">
                  <img src="/src/img/Lobby.jpeg" alt="Lobby Principal" />
                </div>
                <div className="home-gallery-overlay">
                  <h5>Lobby Principal</h5>
                  <p>Elegancia desde la llegada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Testimonios */}
      <section id="testimonios" className="home-testimonials-section">
        <div className="home-container">
          <div className="home-row">
            <div className="home-col-12 home-text-center home-mb-5">
              <h2 className="home-section-title">Lo que dicen nuestros huéspedes</h2>
              <p className="home-section-subtitle">Experiencias reales de quienes nos han visitado</p>
            </div>
          </div>
          
          <div className="home-row home-g-4">
            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-testimonial-card">
                <div className="home-testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="home-testimonial-text">
                  "Una experiencia absolutamente increíble. El servicio fue impecable y las instalaciones 
                  superaron todas mis expectativas. Sin duda regresaré."
                </p>
                <div className="home-testimonial-author">
                  <div className="home-author-image">
                    <i className="bi bi-person-circle fs-1 text-primary"></i>
                  </div>
                  <div className="home-author-info">
                    <h6>María González</h6>
                    <small>Madrid, España</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-testimonial-card">
                <div className="home-testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="home-testimonial-text">
                  "El hotel perfecto para nuestra luna de miel. Cada detalle estaba cuidado al máximo. El personal fue muy atento y profesional."
                </p>
                <div className="home-testimonial-author">
                  <div className="home-author-image">
                    <i className="bi bi-person-circle fs-1 text-primary"></i>
                  </div>
                  <div className="home-author-info">
                    <h6>Carlos & Ana Ruiz</h6>
                    <small>Buenos Aires, Argentina</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-testimonial-card">
                <div className="home-testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="home-testimonial-text">
                  "Las vistas desde mi suite eran espectaculares. La gastronomía del hotel es de nivel mundial. 
                  Una experiencia que vale cada centavo."
                </p>
                <div className="home-testimonial-author">
                  <div className="home-author-image">
                    <i className="bi bi-person-circle fs-1 text-primary"></i>
                  </div>
                  <div className="home-author-info">
                    <h6>Roberto Silva</h6>
                    <small>São Paulo, Brasil</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-testimonial-card">
                <div className="home-testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="home-testimonial-text">
                  "Gracias al equipo de Hotel home por hacer de nuestro aniversario algo inolvidable. La atención al detalle fue super impresionante."
                </p>
                <div className="home-testimonial-author">
                  <div className="home-author-image">
                    <i className="bi bi-person-circle fs-1 text-primary"></i>
                  </div>
                  <div className="home-author-info">
                    <h6>Carla & Juán Gómez</h6>
                    <small>Cancún, México</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-testimonial-card">
                <div className="home-testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="home-testimonial-text">
                  "Este hotel tan lujoso nunca hemos visitado. ¡¡¡QUÉ ENVIDIA!!!"
                </p>
                <div className="home-testimonial-author">
                  <div className="home-author-image">
                    <i className="bi bi-person-circle fs-1 text-primary"></i>
                  </div>
                  <div className="home-author-info">
                    <h6>Hugo Lucas Gómez</h6>
                    <small>Bogotá, Colombia</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="home-col-lg-4 home-col-md-6">
              <div className="home-testimonial-card">
                <div className="home-testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="home-testimonial-text">
                  "Gracias al equipo de Hotel home por hacer de nuestro aniversario algo inolvidable, además nos encanta este hotel porque tiene 10 Habitaciones."
                </p>
                <div className="home-testimonial-author">
                  <div className="home-author-image">
                    <i className="bi bi-person-circle fs-1 text-primary"></i>
                  </div>
                  <div className="home-author-info">
                    <h6>Noelia Yánez</h6>
                    <small>Ciudad Del Este, Paraguay</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer de Contacto */}
      <footer id="contacto" className="home-contact-footer">
        <div className="home-container">
          <div className="home-row">
            <div className="home-col-12 home-text-center home-mb-4">
              <h2 className="home-section-title home-text-white">Contáctanos</h2>
              <p className="home-section-subtitle home-text-white-50">Estamos aquí para hacer realidad tu estadía perfecta</p>
            </div>
          </div>
          
          <div className="home-row home-justify-content-center">
            <div className="home-col-lg-8 home-col-md-10">
              <div className="home-contact-info">
                <div className="home-contact-item">
                  <div className="home-contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="home-contact-details">
                    <h5>Dirección</h5>
                    <p>Avenida Paraíso 123 — Playa Dorada, Costa Tropical — CP 12345</p>
                  </div>
                </div>
                
                <div className="home-contact-item">
                  <div className="home-contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="home-contact-details">
                    <h5>Teléfono</h5>
                    <p>+1 (555) 123-4567 &nbsp; | &nbsp; +1 (555) 765-4321</p>
                  </div>
                </div>
                
                <div className="home-contact-item">
                  <div className="home-contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="home-contact-details">
                    <h5>Email</h5>
                    <p>info@hotelhome.com &nbsp; | &nbsp; reservas@hotelhome.com</p>
                  </div>
                </div>
                
                <div className="home-contact-item">
                  <div className="home-contact-icon">
                    <i className="fas fa-share-alt"></i>
                  </div>
                  <div className="home-contact-details">
                    <h5>Síguenos</h5>
                    <div className="home-social-links">
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
          
          <div className="home-row">
            <div className="home-col-12 home-text-center home-copyright">
              <small className="home-text-white-50">&copy; 2025 Hotel home. Todos los derechos reservados.</small>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;