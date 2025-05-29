import React, { useState } from 'react'
import '../../../Styles/SectBodyPrincipalPage.css'

export const SectBodyPrincipalPage = () => {
  const VideoBackground = "/Video.mp4";

  
  const handleVerEvento = () => {
    navigate('/mapa'); // Aquí podrías pasar parámetros si más adelante quieres mostrar zonas por evento
  };
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? events.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === events.length - 1 ? 0 : prevIndex + 1));
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
            <div className="carousel-container">
              <button className="carousel-button left" onClick={prevSlide} aria-label="Previous Slide">&#8249;</button>
              <div className="carousel-wrapper">
                <ul className="events-list" style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease-in-out' }}>
                  {events.map(event => (
                    <li key={event.id} className="event-card" tabIndex="0">
                      <img src={event.image} alt={`Imagen del ${event.title}`} className="event-image" />
                      <div className="event-info">
                      <button className="event-btn" onClick={handleVerEvento}>Ver Evento</button>
                        <strong>{event.title}</strong> - Fecha: {event.date}
                        <p>{event.description}</p>
                           
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="carousel-button right" onClick={nextSlide} aria-label="Next Slide">&#8250;</button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
