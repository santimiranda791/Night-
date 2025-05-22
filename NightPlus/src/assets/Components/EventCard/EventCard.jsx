import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../Styles/EventCard.css';

export const EventCard = () => {
  const navigate = useNavigate();

  const handleVerEvento = () => {
    navigate('/mapa'); // Aquí podrías pasar parámetros si más adelante quieres mostrar zonas por evento
  };

  return (
    <div className="event-card">
      <div className="event-banner">
        <span className="event-date">VIERNES 09 MAYO</span>
        <div className="image-container">
          <img src="/card.png" alt="Evento DJ" className="dj-image" />
        </div>
      </div>
      <div className="event-details">
        <h2 className="event-title">Noche de Chicas</h2>
        <p className="event-description">
          Evento Oficial De Chicas: ¡Combo de 5 Amigas NO SE COBRA COVER!
        </p>
        <p className="event-club">Discoteca Tropikal-Club</p>
        <button className="event-btn" onClick={handleVerEvento}>Ver Evento</button>
      </div>
    </div>
  );
};