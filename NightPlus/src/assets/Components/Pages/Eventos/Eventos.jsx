// src/assets/Components/Pages/Eventos/Eventos.jsx
import React, { useEffect, useState } from 'react';
import { Header } from '../../Header/Header'; // Asegúrate de que la ruta sea correcta
import { EventCard } from '../../EventCard/EventCard'; // Asegúrate de que la ruta sea correcta
import Swal from 'sweetalert2';
import '../../../../Styles/Eventos.css'; // Asegúrate de que la ruta sea correcta

import React, { useEffect, useState } from 'react';
import { Header } from '../../Header/Header';
import { EventCard } from '../../EventCard/EventCard';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../../../../Styles/Eventos.css';

export const Eventos = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = 'https://backendnight-production.up.railway.app';

  useEffect(() => {
    console.log("Eventos.jsx: Iniciando fetch de la lista de eventos...");
    fetch(`${BASE_URL}/servicio/eventos-list`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al cargar eventos: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Eventos.jsx: Datos de eventos recibidos de la API:", data);
        const eventosProcesados = data.map(evento => {
          console.log(`Eventos.jsx: Procesando evento - idEvento de API: ${evento.idEvento}, nombre: ${evento.nombreEvento}`);

          if (!evento.idEvento) {
            console.warn(`Eventos.jsx: Evento sin ID válido encontrado, nombre: ${evento.nombreEvento}. Será ignorado o se le asignará un ID temporal.`);
            return null;
          }

          return {
            id: evento.idEvento,
            date: `${evento.fecha} ${evento.hora}`,
            title: evento.nombreEvento,
            description: evento.descripcion,
            club: evento.discoteca?.nombre || 'Sin discoteca',
            image: evento.imagen || '/card.png',
          };
        }).filter(Boolean);

        setEvents(eventosProcesados);
      })
      .catch(error => {
        Swal.fire('Error', 'No se pudieron cargar los eventos', 'error');
        console.error("Eventos.jsx: Error en el fetch de la lista de eventos:", error);
      });
  }, []);

  const handleEventClick = (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Debes iniciar sesión primero',
        text: 'Para acceder a este evento, debes iniciar sesión primero.',
      });
      return; // Prevent navigation
    } else {
      navigate(`/mapa/${eventId}`);
    }
  };

  return (
    <>
      <Header />
      <div className="eventos-container">
        {events.length === 0 ? (
          <p>Cargando eventos o no hay eventos disponibles...</p>
        ) : (
          events.map(event => (
            console.log(`Eventos.jsx: Renderizando EventCard para ID: ${event.id}, Título: ${event.title}`),
            <EventCard
              key={event.id}
              eventId={event.id}
              date={event.date}
              title={event.title}
              description={event.description}
              club={event.club}
              image={event.image}
              onClick={handleEventClick}
            />
          ))
        )}
      </div>
    </>
  );
};
