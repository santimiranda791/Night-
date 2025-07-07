// src/assets/Components/Pages/Eventos/Eventos.jsx
import React, { useEffect, useState } from 'react';
import { Header } from '../../Header/Header'; // Asegúrate de que la ruta sea correcta
import { EventCard } from '../../EventCard/EventCard'; // Asegúrate de que la ruta sea correcta
import Swal from 'sweetalert2'; // Importa SweetAlert2 para las alertas
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación
import '../../../../Styles/Eventos.css'; // Asegúrate de que la ruta sea correcta

export const Eventos = () => {
  // Estado para almacenar la lista de eventos
  const [events, setEvents] = useState([]);
  // Hook para la navegación programática
  const navigate = useNavigate();

  // URL base de tu backend desplegado en Railway
  const BASE_URL = 'https://backendnight-production.up.railway.app';

  // useEffect para cargar los eventos cuando el componente se monta
  useEffect(() => {
    console.log("Eventos.jsx: Iniciando fetch de la lista de eventos...");
    // Realiza la petición a la API para obtener la lista de eventos
    fetch(`${BASE_URL}/servicio/eventos-list`)
      .then(response => {
        // Verifica si la respuesta de la red fue exitosa
        if (!response.ok) {
          // Si no fue exitosa, lanza un error con el estado y texto de la respuesta
          throw new Error(`Error al cargar eventos: ${response.status} ${response.statusText}`);
        }
        // Si la respuesta es exitosa, parsea el cuerpo de la respuesta como JSON
        return response.json();
      })
      .then(data => {
        console.log("Eventos.jsx: Datos de eventos recibidos de la API:", data);
        // Procesa los datos recibidos para adaptarlos al formato esperado por EventCard
        const eventosProcesados = data.map(evento => {
          console.log(`Eventos.jsx: Procesando evento - idEvento de API: ${evento.idEvento}, nombre: ${evento.nombreEvento}`);

          // Valida que el evento tenga un ID válido
          if (!evento.idEvento) {
            console.warn(`Eventos.jsx: Evento sin ID válido encontrado, nombre: ${evento.nombreEvento}. Será ignorado o se le asignará un ID temporal.`);
            return null; // Ignora eventos sin ID válido
          }

          // Retorna el objeto de evento formateado
          return {
            id: evento.idEvento,
            date: `${evento.fecha} ${evento.hora}`, // Combina fecha y hora
            title: evento.nombreEvento,
            description: evento.descripcion,
            club: evento.discoteca?.nombre || 'Sin discoteca', // Acceso seguro a nombre de discoteca
            image: evento.imagen || '/card.png', // Imagen predeterminada si no hay
          };
        }).filter(Boolean); // Filtra cualquier evento que haya sido null (sin ID válido)

        setEvents(eventosProcesados); // Actualiza el estado con los eventos procesados
      })
      .catch(error => {
        // Captura y maneja cualquier error durante la petición o el procesamiento
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: 'Error',
          text: 'No se pudieron cargar los eventos. Por favor, inténtalo de nuevo más tarde.',
        });
        console.error("Eventos.jsx: Error en el fetch de la lista de eventos:", error);
      });
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  // Función para manejar el clic en una tarjeta de evento
  const handleEventClick = (event, eventId) => {
    event.preventDefault(); // Previene el comportamiento por defecto del enlace
    event.stopPropagation(); // Detiene la propagación del evento para evitar clics duplicados

    // Intenta obtener el token de autenticación del localStorage
    const token = localStorage.getItem('token');

    // Validación: Si no hay token, el usuario no está logueado
    if (!token) {
      // Muestra una alerta informando al usuario que debe iniciar sesión
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Debes iniciar sesión primero',
        text: 'Para acceder a este evento, necesitas tener una sesión activa.',
      });
      return; // Detiene la ejecución de la función para prevenir la navegación
    } else {
      // Si el token existe, navega a la página de detalles del mapa para el evento específico
      navigate(`/mapa/${eventId}`);
    }
  };

  return (
    <>
      <Header /> {/* Componente de cabecera */}
      <div className="eventos-container"> {/* Asegúrate de que esta clase esté aplicada */}
        {/* Muestra un mensaje de carga o de no eventos si la lista está vacía */}
        {events.length === 0 ? (
          <p className="loading-message">Cargando eventos o no hay eventos disponibles...</p>
        ) : (
          // Mapea y renderiza cada EventCard para los eventos cargados
          events.map(event => (
            console.log(`Eventos.jsx: Renderizando EventCard para ID: ${event.id}, Título: ${event.title}`),
            <EventCard
              key={event.id} // Clave única para cada componente EventCard
              eventId={event.id} // Pasa el ID del evento
              date={event.date}
              title={event.title}
              description={event.description}
              club={event.club}
              image={event.image}
              onClick={handleEventClick} // Pasa la función de manejo de clic
            />
          ))
        )}
      </div>
    </>
  );
};
