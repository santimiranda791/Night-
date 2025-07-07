import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Importa NavLink
import Swal from 'sweetalert2'; // Importa SweetAlert2
import '../../../Styles/EventCard.css';

export const EventCard = ({ date, title, image, eventId, onClick }) => {
  const navigate = useNavigate();

  // La función handleClick ahora maneja toda la lógica de navegación.
  // El NavLink ya no tendrá una 'to' prop directa, forzando la navegación programática.
  const handleClick = async (event) => {
    // Siempre previene el comportamiento por defecto del evento del clic,
    // ya que ahora controlaremos la navegación manualmente.
    event.preventDefault();
    event.stopPropagation(); // Detiene la propagación del evento

    const token = localStorage.getItem('token');

    // Validación: Si no hay token, el usuario no está logueado
    if (!token) {
      // Muestra una alerta informando al usuario que debe iniciar sesión.
      // Usamos 'await' para asegurar que la alerta se muestre y se cierre
      // antes de que la función termine.
      await Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Debes iniciar sesión primero',
        text: 'Para acceder a este evento, necesitas tener una sesión activa.',
      });
      return; // Detiene la ejecución de la función aquí
    }

    // Si un 'onClick' personalizado fue proporcionado desde el padre, lo llamamos.
    // Esto es útil si el componente padre (como Eventos.jsx) tiene lógica adicional
    // que debe ejecutarse ANTES de la navegación.
    if (onClick) {
      // Pasamos el evento original y el eventId al onClick del padre.
      // Es responsabilidad del padre decidir si navega o no.
      onClick(event, eventId);
    } else {
      // Si hay token y no hay un onClick personalizado,
      // navega programáticamente a la página del mapa del evento.
      navigate(`/mapa/${eventId}`);
    }
  };

  return (
    // Eliminamos la prop 'to' del NavLink. Ahora, el NavLink actúa como un contenedor
    // con estilos de enlace, pero la navegación es controlada por handleClick.
    <NavLink to="#" className="event-mini-card" onClick={handleClick}>
      <img src={image} alt={title} className="event-mini-img" />
      <div className="event-mini-details">
        <span className="event-mini-title">{title}</span>
        <span className="event-mini-date">{date}</span>
      </div>
    </NavLink>
  );
};
