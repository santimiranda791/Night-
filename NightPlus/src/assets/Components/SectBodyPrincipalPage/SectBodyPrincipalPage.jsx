import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../Styles/SectBodyPrincipalPage.css';
import Swal from 'sweetalert2';

export const SectBodyPrincipalPage = () => {
  const VideoBackground = "/Video.mp4";
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/servicio/eventos-list');
        if (!response.ok) {
          throw new Error(`Error al cargar eventos: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        const processedEvents = data.map(evento => ({
          id: evento.idEvento,
          title: evento.nombreEvento,
          date: `${evento.fecha} ${evento.hora}`,
          description: evento.descripcion,
          image: evento.imagen || '/card.png'
        }));
        
        setEvents(processedEvents);
      } catch (error) {
        console.error("Error al cargar los eventos para el carrusel:", error);
        Swal.fire('Error', 'No se pudieron cargar los eventos para el carrusel.', 'error');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);


  const handleVerEvento = (id) => {
    navigate(`/view-event/${id}`);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? events.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === events.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (idx) => setCurrentIndex(idx);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) prevSlide();
    else if (diff < -50) nextSlide();
    touchStartX.current = null;
  };

  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewName.trim() && reviewText.trim()) {
      setReviews(prev => [
        { name: reviewName, text: reviewText },
        ...prev
      ]);
      setReviewName("");
      setReviewText("");
    }
  };

  return (
    <>
      <div className='video-container'>
        <video autoPlay loop muted className="background-video" playsInline>
          <source src={VideoBackground} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="body-container">
        <div className="content">
          <h1>Bienvenido a la página principal</h1>
          <p>Este es el contenido principal de la página con un video de fondo.</p>

          <section className="upcoming-events">
            <h2>Próximos Eventos</h2>
            {loadingEvents ? (
              <p>Cargando eventos...</p>
            ) : events.length === 0 ? (
              <p>No hay eventos disponibles en este momento.</p>
            ) : (
              <div
                className="carousel-gold-container"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <button className="carousel-gold-btn left" onClick={prevSlide} aria-label="Anterior">&#8249;</button>
                <div className="carousel-gold-wrapper">
                  <ul
                    className="carousel-gold-list"
                    style={{
                      transform: `translateX(-${currentIndex * 100}%)`,
                      transition: 'transform 0.6s cubic-bezier(.77,0,.18,1)'
                    }}
                  >
                    {events.map(event => (
                      <li key={event.id} className="carousel-gold-card" tabIndex="0">
                        <div className="carousel-gold-img-wrap">
                          <img src={event.image} alt={`Imagen del ${event.title}`} className="carousel-gold-img" />
                        </div>
                        {/* Se ha eliminado el div con la información del evento aquí */}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="carousel-gold-btn right" onClick={nextSlide} aria-label="Siguiente">&#8250;</button>
              </div>
            )}
            {events.length > 0 && !loadingEvents && (
              <div className="carousel-gold-indicators">
                {events.map((_, idx) => (
                  <span
                    key={idx}
                    className={`carousel-dot${currentIndex === idx ? ' active' : ''}`}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Ir al evento ${idx + 1}`}
                    style={{ cursor: 'pointer', fontSize: '2rem', margin: '0 6px', color: currentIndex === idx ? '#a259e4' : '#fff', transition: 'color 0.3s' }}
                  >
                    &bull;
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};  