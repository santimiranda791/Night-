import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2 para las alertas
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
        // Asegúrate de que el endpoint para obtener eventos sea '/servicio/eventos-list'
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

  // Función para manejar el clic en "Ver Evento" con validación de sesión
  const handleVerEvento = async (id) => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    // Si no hay token, el usuario no está logueado
    if (!token) {
      // Muestra una alerta informando al usuario que debe iniciar sesión
      await Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Debes iniciar sesión primero',
        text: 'Para acceder a este evento, necesitas tener una sesión activa.',
      });
      return; // Detiene la ejecución de la función
    }

    // Si hay token, navega a la ruta interna de tu aplicación
    navigate(`/mapa/${id}`);
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
                        {/* Llama a la función handleVerEvento que ahora incluye la validación */}
                        <button className="event-btn" onClick={() => handleVerEvento(event.idEvento)}>Ver Evento</button>
                      </div>
                    </div>
                  ))}
                </div>
                {events[2] && ( // Mostrar el tercer evento si existe
                  <div className="row center">
                    <div className="event-card-custom">
                      <div className="event-card-img-wrap">
                        <img src={events[2].imagen || "/card.png"} alt={`Imagen del ${events[2].nombreEvento}`} className="event-card-img" />
                        {/* Llama a la función handleVerEvento que ahora incluye la validación */}
                        <button className="event-btn" onClick={() => handleVerEvento(events[2].idEvento)}>Ver Evento</button>
                      </div>
                    </div>
                  </div>
                )}
                {events.length > 3 && (
                  <div className="row center">
                    {/* Este botón puede navegar directamente a la página de eventos, donde EventCard ya tiene su propia validación */}
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
