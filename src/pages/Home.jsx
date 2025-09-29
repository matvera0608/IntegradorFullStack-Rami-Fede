import React from 'react';
import Navbar from '../components/Landing_Navbar';
import '../styles/Home.css';
function Home() {
  return (
    <>
    <section id="servicios" className="services-section">
  <div className="container">
    <div className="titulo">
      <div className="col-12 text-center mb-5">
        <h2 className="section-title">¿Por qué elegir Hotel Paradise?</h2>
        <p className="section-subtitle">Descubre las características que nos hacen únicos</p>
      </div>
    </div>
    
    <div className="services-container"> {/* Este es el contenedor importante */}
      <div className="service-card">
        <div className="service-icon luxury-icon">
          <i className="fas fa-crown"></i>
        </div>
        <h4>Lujo Premium</h4>
        <p>Habitaciones y suites diseñadas con los más altos estándares de elegancia y confort.</p>
      </div>
      
      <div className="service-card">
        <div className="service-icon location-icon">
          <i className="fas fa-map-marker-alt"></i>
        </div>
        <h4>Ubicación Privilegiada</h4>
        <p>Ubicado en primera línea de playa con vistas espectaculares al océano y montañas.</p>
      </div>
      
      <div className="service-card">
        <div className="service-icon dining-icon">
          <i className="fas fa-utensils"></i>
        </div>
        <h4>Gastronomía Excepcional</h4>
        <p>Restaurantes gourmet con chefs internacionales y servicio de habitación 24/7.</p>
      </div>
    </div>
  </div>
</section>
<section id="galeria" className="gallery-section">
    <div className="container">
        <div className="row">
            <div className="col-12 text-center mb-5">
                <h2 className="section-title text-white">Nuestras Instalaciones</h2>
                <p className="section-subtitle text-white-50">Un vistazo a la experiencia que te espera</p>
            </div>
        </div>
        
        <div className="row g-4">
            <div className="col-lg-4 col-md-6">
                <div className="gallery-item">
                    <div className="gallery-placeholder">
                        <img src="/src/img/Vista.jpg" alt="Suite Presidential" />
                    </div>
                    <div className="gallery-overlay">
                        <h5>Suite Presidencial</h5>
                        <p>Vista panorámica al océano</p>
                    </div>
                </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
                <div className="gallery-item">
                    <div className="gallery-placeholder">
                        <img src="/src/img/piscina.jpg" alt="Piscina" />
                    </div>
                    <div className="gallery-overlay">
                        <h5>Piscina</h5>
                        <p>Relájate con vistas espectaculares</p>
                    </div>
                </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
                <div className="gallery-item">
                    <div className="gallery-placeholder">
                        <img src="src/img/plato.png" alt="Restaurante Gourmet" />
                    </div>
                    <div className="gallery-overlay">
                        <h5>Restaurante Gourmet</h5>
                        <p>Experiencia culinaria única</p>
                    </div>
                </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
                <div className="gallery-item">
                    <div className="gallery-placeholder">
                        <img src="/src/img/ServicioCuarto.jpeg" alt="Servicio al Cuarto" />
                    </div>
                    <div className="gallery-overlay">
                        <h5>Servicio al Cuarto de Lujo</h5>
                        <p>Disponible 24 hs</p>
                    </div>
                </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
                <div className="gallery-item">
                    <div className="gallery-placeholder">
                        <img src="src/img/imgPlaya.png" alt="Playa Privada" />
                    </div>
                    <div className="gallery-overlay">
                        <h5>Playa Privada</h5>
                        <p>Arena blanca y aguas cristalinas</p>
                    </div>
                </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
                <div className="gallery-item">
                    <div className="gallery-placeholder">
                        <img src="/src/img/Lobby.jpeg" alt="Lobby Principal" />
                    </div>
                    <div className="gallery-overlay">
                        <h5>Lobby Principal</h5>
                        <p>Elegancia desde la llegada</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
    <section id="testimonios" class="testimonials-section">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center mb-5">
                    <h2 class="section-title">Lo que dicen nuestros huéspedes</h2>
                    <p class="section-subtitle">Experiencias reales de quienes nos han visitado</p>
                </div>
            </div>
            
            <div class="row g-4">
                <div class="col-lg-4 col-md-6">
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">
                            "Una experiencia absolutamente increíble. El servicio fue impecable y las instalaciones 
                            superaron todas mis expectativas. Sin duda regresaré."
                        </p>
                        <div class="testimonial-author">
                            <div class="author-image">
                                 <i class="bi bi-person-circle fs-1 text-primary"></i>
                            </div>
                            <div class="author-info">
                                <h6>María González</h6>
                                <small>Madrid, España</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4 col-md-6">
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">
                            "El hotel perfecto para nuestra luna de miel. Cada detalle estaba cuidado al máximo. El personal fue muy atento y profesional."
                        </p>
                        <div class="testimonial-author">
                            <div class="author-image">
                                   <i class="bi bi-person-circle fs-1 text-primary"></i>
                            </div>
                            <div class="author-info">
                                <h6>Carlos & Ana Ruiz</h6>
                                <small>Buenos Aires, Argentina</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4 col-md-6">
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">
                            "Las vistas desde mi suite eran espectaculares. La gastronomía del hotel es de nivel mundial. 
                            Una experiencia que vale cada centavo."
                        </p>
                    <div class="testimonial-author">
                            <div class="author-image">
                                   <i class="bi bi-person-circle fs-1 text-primary"></i>
                            </div>
                            <div class="author-info">
                                <h6>Roberto Silva</h6>
                                <small>São Paulo, Brasil</small>
                            </div>
                        </div>
                    </div>
                 </div>
              <div class="col-lg-4 col-md-6">
                <div class="testimonial-card">
                    <div class="testimonial-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p class="testimonial-text">
                        "Gracias al equipo de Hotel Paradise por hacer de nuestro aniversario algo inolvidable. La atención al detalle fue super impresionante."
                    </p>
                    <div class="testimonial-author">
                        <div class="author-image">
                              <i class="bi bi-person-circle fs-1 text-primary"></i>
                        </div>
                        <div class="author-info">
                            <h6>Carla & Juán Gómez</h6>
                            <small>Cancún, México</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="testimonial-card">
                    <div class="testimonial-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p class="testimonial-text">
                        "Este hotel tan lujoso nunca hemos visitado. ¡¡¡QUÉ ENVIDIA!!!"
                    </p>
                    <div class="testimonial-author">
                        <div class="author-image">
                              <i class="bi bi-person-circle fs-1 text-primary"></i>
                        </div>
                        <div class="author-info">
                            <h6>Hugo Lucas Gómez</h6>
                            <small>Bogotá, Colombia</small>
                        </div>
                    </div>
                </div>
              </div>

            <div class="col-lg-4 col-md-6">
                <div class="testimonial-card">
                    <div class="testimonial-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p class="testimonial-text">
                        "Gracias al equipo de Hotel Paradise por hacer de nuestro aniversario algo inolvidable, además nos encanta este hotel porque tiene 10 Habitaciones."
                    </p>
                    <div class="testimonial-author">
                        <div class="author-image">
                              <i class="bi bi-person-circle fs-1 text-primary"></i>
                        </div>
                        <div class="author-info">
                            <h6>Noelia Yánez </h6>
                            <small>Ciudad Del Este, Paraguay</small>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </section>
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
