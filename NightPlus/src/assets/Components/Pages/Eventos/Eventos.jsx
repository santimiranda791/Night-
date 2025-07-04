// src/assets/Components/Pages/Eventos/Eventos.jsx
import React, { useEffect, useState } from 'react';
import { Header } from '../../Header/Header'; // Asegúrate de que la ruta sea correcta
import { EventCard } from '../../EventCard/EventCard'; // Asegúrate de que la ruta sea correcta
import Swal from 'sweetalert2';
import '../../../../Styles/Eventos.css'; // Asegúrate de que la ruta sea correcta

export const Eventos = () => {
  const [events, setEvents] = useState([]);

  // Define la URL base de tu backend desplegado en Railway
  const BASE_URL = 'https://backendnight-production.up.railway.app'; // <--- ¡URL ACTUALIZADA AQUÍ!

  useEffect(() => {
    console.log("Eventos.jsx: Iniciando fetch de la lista de eventos...");
    fetch(`${BASE_URL}/servicio/eventos-list`) // <--- URL ACTUALIZADA
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al cargar eventos: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Eventos.jsx: Datos de eventos recibidos de la API:", data);
        const eventosProcesados = data.map(evento => {
          // *** PUNTO CLAVE: VERIFICA QUE 'evento.idEvento' REALMENTE EXISTA Y SEA UN NÚMERO ***
          // Este log te dirá el ID que se está mapeando desde el backend.
          console.log(`Eventos.jsx: Procesando evento - idEvento de API: ${evento.idEvento}, nombre: ${evento.nombreEvento}`);

          // Si por alguna razón el ID es null o undefined, puedes poner un valor por defecto
          // O, mejor aún, filtrar el evento si no tiene un ID válido.
          if (!evento.idEvento) {
            console.warn(`Eventos.jsx: Evento sin ID válido encontrado, nombre: ${evento.nombreEvento}. Será ignorado o se le asignará un ID temporal.`);
            return null; // Omitir este evento si no tiene un ID
          }

          return {
            id: evento.idEvento, // Aquí se mapea el ID de tu entidad de Spring Boot
            date: `${evento.fecha} ${evento.hora}`,
            title: evento.nombreEvento,
            description: evento.descripcion,
            club: evento.discoteca?.nombre || 'Sin discoteca',
            image: evento.imagen || '/card.png',
          };
        }).filter(Boolean); // Filtra cualquier 'null' si omitiste eventos sin ID

        setEvents(eventosProcesados);
      })
      .catch(error => {
        Swal.fire('Error', 'No se pudieron cargar los eventos', 'error');
        console.error("Eventos.jsx: Error en el fetch de la lista de eventos:", error);
      });
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  return (
    <>
      <Header />
      <div className="eventos-container">
        {events.length === 0 ? (
          <p>Cargando eventos o no hay eventos disponibles...</p>
        ) : (
          events.map(event => (
            // Este log te mostrará el ID que se envía a EventCard.
            console.log(`Eventos.jsx: Renderizando EventCard para ID: ${event.id}, Título: ${event.title}`),
            <EventCard
              key={event.id} // 'key' debe ser único y estable. Si event.id es undefined aquí, habrá un warning.
              eventId={event.id} // Aquí pasamos el ID al componente EventCard
              date={event.date}
              title={event.title}
              description={event.description}
              club={event.club}
              image={event.image}
            />
          ))
        )}
      </div>
    </>
  );
};
