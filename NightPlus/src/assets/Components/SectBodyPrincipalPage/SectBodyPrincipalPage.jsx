import React, { useState, useEffect } from 'react'; // Importar useEffect
import { useNavigate } from 'react-router-dom';
import '../../../Styles/SectBodyPrincipalPage.css';

export const SectBodyPrincipalPage = () => {
  const VideoBackground = "/Video.mp4";
  const navigate = useNavigate();

  // Estado para almacenar los eventos cargados desde el backend
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null);   // Estado de error

  // URL base de tu backend (ajusta si es diferente)
  const BASE_URL = 'http://localhost:8080'; // Asegúrate que esta sea tu URL de backend

  // useEffect para cargar los eventos cuando el componente se monta
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true); // Iniciar carga
        const response = await fetch(`${BASE_URL}/servicio/eventos`); // Endpoint para obtener todos los eventos
        if (!response.ok) {
          throw new Error(`Error al cargar eventos: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setEvents(data); // Almacenar los eventos en el estado
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message); // Guardar el mensaje de error
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchEvents(); // Llamar a la función para cargar eventos
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

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
            {loading ? (
              <p>Cargando eventos...</p> // Mostrar mensaje de carga
            ) : error ? (
              <p>Error al cargar eventos: {error}</p> // Mostrar mensaje de error
            ) : events.length === 0 ? (
              <p>No hay eventos disponibles en este momento.</p> // Si no hay eventos
            ) : (
              <div className="custom-events-grid">
                <div className="row">
                  {/* Asegúrate de que los datos del backend tengan las propiedades correctas (id, nombreEvento, imagen) */}
                  {/* Usamos 'nombreEvento' en lugar de 'title' y 'imagen' en lugar de 'image' */}
                  {events.slice(0, 2).map(event => (
                    <div className="event-card-custom" key={event.idEvento}> {/* Usar event.idEvento como key */}
                      <div className="event-card-img-wrap">
                        <img src={event.imagen || "/card.png"} alt={`Imagen del ${event.nombreEvento}`} className="event-card-img" /> {/* Usar event.imagen y un fallback */}
                        <button className="event-btn" onClick={() => handleVerEvento(event.idEvento)}>Ver Evento</button> {/* Usar event.idEvento */}
                      </div>
                      <h3>{event.nombreEvento}</h3> {/* Mostrar el nombre del evento */}
                      <p>{event.fecha} - {event.hora}</p> {/* Mostrar fecha y hora */}
                      <p>{event.descripcion}</p> {/* Mostrar descripción */}
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
                      <h3>{events[2].nombreEvento}</h3>
                      <p>{events[2].fecha} - {events[2].hora}</p>
                      <p>{events[2].descripcion}</p>
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