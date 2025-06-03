import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../../Styles/SectBodyPrincipalPage.css'

export const SectBodyPrincipalPage = () => {
  const VideoBackground = "/Video.mp4";
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  const events = [
    {
      id: 1,
      title: "Evento 1",
      date: "2024-07-01",
      description: "Descripción breve del evento 1.",
      image: "/card.png"
    },
    {
      id: 2,
      title: "Evento 2",
      date: "2024-07-15",
      description: "Descripción breve del evento 2.",
      image: "/card.png"
    },
    {
      id: 3,
      title: "Evento 3",
      date: "2024-08-05",
      description: "Descripción breve del evento 3.",
      image: "/card.png"
    },
    {
      id: 4,
      title: "Evento 4",
      date: "2024-08-20",
      description: "Descripción breve del evento 4.",
      image: "/card.png"
    }
  ];


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

  // Touch events for mobile
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
                      <div className="carousel-gold-info">
                        <strong>{event.title}</strong>
                        <div className="carousel-gold-date">Fecha: {event.date}</div>
                        <p>{event.description}</p>
                        <button className="carousel-gold-event-btn" onClick={() => handleVerEvento(event.id)}>Ver Evento</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="carousel-gold-btn right" onClick={nextSlide} aria-label="Siguiente">&#8250;</button>
            </div>
            <div className="carousel-gold-indicators">
              {events.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-gold-dot${currentIndex === idx ? ' active' : ''}`}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Ir al evento ${idx + 1}`}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
