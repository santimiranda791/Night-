import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../Styles/EventCard.css';

export const EventCard = ({ date, title, image, eventId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/mapa/${eventId}`);
  };

  return (
    <div className="event-mini-card" onClick={handleClick}>
      <img src={image} alt={title} className="event-mini-img" />
      <div className="event-mini-details">
        <span className="event-mini-title">{title}</span>
        <span className="event-mini-date">{date}</span>
      </div>
    </div>
  );
};
