import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../Styles/SectBodyPrincipalPage.css';

export const SectBodyPrincipalPage = () => {
  const VideoBackground = "/Video.mp4";
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL base de tu backend en Railway.app
  const BASE_URL = 'https://backendnight-production.up.railway.app'; 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // CAMBIO: Asegúrate de que el endpoint para obtener eventos sea '/servicio/eventos-list'
        const response = await fetch(`${BASE_URL}/servicio/eventos-list`);
        if (!response.ok) {
          throw new Error(`Error al cargar eventos: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // CAMBIO: La función handleVerEvento ahora navega a /mapa/{id}
  const handleVerEvento = (id) => {
    navigate(`/mapa/${id}`); // Navega a la ruta interna de tu aplicación
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
            {loading ? (
              <p>Cargando eventos...</p>
            ) : error ? (
              <p>Error al cargar eventos: {error}</p>
            ) : events.length === 0 ? (
              <p>No hay eventos disponibles en este momento.</p>
            ) : (
              <div className="custom-events-grid">
                <div className="row">
                  {events.slice(0, 2).map(event => (
                    <div className="event-card-custom" key={event.idEvento}>
                      <div className="event-card-img-wrap">
                        <img src={event.imagen || "/card.png"} alt={`Imagen del ${event.nombreEvento}`} className="event-card-img" />
                        <button className="event-btn" onClick={() => handleVerEvento(event.idEvento)}>Ver Evento</button>
                      </div>
                      {/* CAMBIO: Eliminado el título, fecha/hora y descripción */}
                    </div>
                  ))}
                </div>
                {events[2] && ( // Mostrar el tercer evento si existe
                  <div className="row center">
                    <div className="event-card-custom">
                      <div className="event-card-img-wrap">
                        <img src={events[2].imagen || "/card.png"} alt={`Imagen del ${events[2].nombreEvento}`} className="event-card-img" />
                        <button className="event-btn" onClick={() => handleVerEvento(events[2].idEvento)}>Ver Evento</button>
                      </div>
                      {/* CAMBIO: Eliminado el título, fecha/hora y descripción */}
                    </div>
                  </div>
                )}
                {/* Puedes añadir un botón o enlace para "Ver más eventos" si hay más de 3 */}
                {events.length > 3 && (
                  <div className="row center">
                    <button className="event-btn" onClick={() => navigate('/events')}>Ver todos los Eventos</button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};