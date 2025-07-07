import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Si usas React Router para obtener el ID del evento
import { UserReservationForm } from './UserReservationForm'; // Ajusta la ruta

export const EventDetailPage = () => {
  const { id } = useParams(); // Obtener el ID del evento de la URL (si usas React Router)
  const [evento, setEvento] = useState(null);
  const [loadingEvento, setLoadingEvento] = useState(true);
  const [errorEvento, setErrorEvento] = useState(null);

  const BASE_URL = 'https://backendnight-production.up.railway.app';

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoadingEvento(true);
        // Aquí deberías tener un endpoint en tu backend para obtener un evento por ID
        // Por ejemplo: GET /servicio/evento/{id}
        const response = await fetch(`${BASE_URL}/servicio/evento/${id}`);
        if (!response.ok) {
          throw new Error(`Error al cargar el evento: ${response.statusText}`);
        }
        const data = await response.json();
        setEvento(data);
      } catch (err) {
        setErrorEvento(err.message);
      } finally {
        setLoadingEvento(false);
      }
    };

    if (id) {
      fetchEvento();
    }
  }, [id]);

  const handleReservaExitosa = (nuevaReserva) => {
    console.log("Reserva creada con éxito:", nuevaReserva);
    // Aquí puedes añadir lógica adicional después de una reserva exitosa,
    // como redirigir al usuario a su perfil o mostrar un mensaje de confirmación.
  };

  if (loadingEvento) {
    return <p>Cargando detalles del evento...</p>;
  }

  if (errorEvento) {
    return <p>Error: {errorEvento}</p>;
  }

  if (!evento) {
    return <p>Evento no encontrado.</p>;
  }

  return (
    <div className="event-detail-page">
      <h1>{evento.nombreEvento}</h1>
      <p>Descripción: {evento.descripcion}</p>
      <p>Fecha: {evento.fecha}</p>
      <p>Hora: {evento.hora}</p>
      <p>Precio: ${evento.precio}</p>
      {/* Puedes mostrar más detalles del evento aquí */}

      {/* Aquí es donde se usa el componente de formulario de reserva */}
      <UserReservationForm 
        idEventoSeleccionado={evento.idEvento} 
        onReservaExitosa={handleReservaExitosa} 
      />
    </div>
  );
};
