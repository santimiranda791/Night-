import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../Styles/EventCard.css'; // Asegúrate de que esta ruta sea correcta

export const EventCard = ({ date, title, image, eventId, club, onClick }) => {
  const navigate = useNavigate();

  const handleClick = async (event) => {
    const token = localStorage.getItem('token');

    if (!token) {
      event.preventDefault(); // Previene la navegación por defecto del NavLink
      event.stopPropagation(); // Detiene la propagación del evento

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

    // Si se proporciona un 'onClick' personalizado desde el padre, lo llamamos.
    // Esto permite que el componente padre (como Eventos.jsx) maneje la navegación o lógica adicional.
    if (onClick) {
      onClick(event, eventId);
    } else {
      // Si no se proporciona un 'onClick' personalizado y hay token,
      // navega programáticamente a la página del mapa del evento.
      navigate(`/mapa/${eventId}`);
    }
  };

  return (
    // CAMBIO CLAVE: La clase principal del NavLink ahora es "evento-card"
    // Esto asegura que los estilos definidos en Eventos.css se apliquen.
    <NavLink to={`/mapa/${eventId}`} className="evento-card" onClick={handleClick}>
      <div className="event-img-wrap"> {/* Contenedor para la imagen */}
        <img src={image} alt={`Imagen del evento ${title}`} className="event-img" /> {/* Clase "event-img" */}
      </div>
      <div className="event-details"> {/* Contenedor para los detalles del texto */}
        <span className="event-title">{title}</span> {/* Clase "event-title" */}
        <span className="event-date">{date}</span> {/* Clase "event-date" */}
        <span className="event-club">{club}</span> {/* Clase "event-club" para el nombre del club */}
      </div>
    </NavLink>
  );
};
