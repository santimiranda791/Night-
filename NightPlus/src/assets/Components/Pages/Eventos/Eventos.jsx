import React, { useEffect, useState } from 'react';
import { Header } from '../../Header/Header';
import { EventCard } from '../../EventCard/EventCard';
import Swal from 'sweetalert2';
import '../../../../Styles/Eventos.css';

export const Eventos = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/servicio/eventos-list')
      .then(response => {
        if (!response.ok) throw new Error(`Error al cargar eventos: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        const eventosProcesados = data.map(evento => {
          if (!evento.idEvento) return null;
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
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="eventos14-container">
        <div className="evento-principal">
          <h2>Clandestino - #73 Mejores Clubs del Mundo</h2>
          <p>#Festival1414</p>
          <button className="boton-fucsia">Las entradas no están a la venta</button>
          <a className="ver-otros-eventos" href="#">Ver otros eventos</a>
          <div className="ubicacion">
            <h3>Horario y ubicación</h3>
            <p>28 de jun 2025, 9:00 p.m. – 29 de jun 2025, 5:00 a.m.</p>
            <p>Neiva, Carrera 16 #4156, Comuna 2, Neiva, Huila, Colombia</p>
          </div>
        </div>

        <div className="eventos-lateral">
          {events.length === 0 ? (
            <p>Cargando eventos...</p>
          ) : (
            events.map(event => (
              <EventCard key={event.id} {...event} />
            ))
          )}
        </div>
      </div>
    </>
  );
};
