import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../../Styles/SectBodyPrincipalPage.css'

export const SectBodyPrincipalPage = () => {
  const VideoBackground = "/Video.mp4";
  const navigate = useNavigate();

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
    }
  ];

  const handleVerEvento = (id) => {
    navigate(`/view-event/${id}`);
  };

  return (
    <>
      <div className='video-container'>
        <video autoPlay loop muted className="background-video" playsInline>
          <source src={VideoBackground} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay-text">
          <h1>Night+</h1>
        </div>
      </div>

      <div className="body-container">
        <div className="content">
          <h1>Bienvenido a la página principal</h1>
          <p>Este es el contenido principal de la página con un video de fondo.</p>

          <section className="upcoming-events">
            <h2>Próximos Eventos</h2>
            <div className="custom-events-grid">
              <div className="row">
                {events.slice(0, 2).map(event => (
                  <div className="event-card-custom" key={event.id}>
                    <div className="event-card-img-wrap">
                      <img src={event.image} alt={`Imagen del ${event.title}`} className="event-card-img" />
                      <button className="event-btn" onClick={() => handleVerEvento(event.id)}>Ver Evento</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row center">
                {events[2] && (
                  <div className="event-card-custom">
                    <div className="event-card-img-wrap">
                      <img src={events[2].image} alt={`Imagen del ${events[2].title}`} className="event-card-img" />
                      <button className="event-btn" onClick={() => handleVerEvento(events[2].id)}>Ver Evento</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}