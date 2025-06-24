import React, { useEffect, useState } from 'react'
import { Header } from '../../Header/Header'
import { EventCard } from '../../EventCard/EventCard'
import Swal from 'sweetalert2'
import '../../../../Styles/Eventos.css'
export const Eventos = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
  fetch('http://localhost:8080/servicio/eventos-list')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar eventos')
      }
      return response.json()
    })
    .then(data => {
      const eventos = data.map(evento => ({
        id: evento.idEvento,
        date: `${evento.fecha} ${evento.hora}`, // usa fecha y hora reales
        title: evento.nombreEvento, // campo correcto
        description: evento.descripcion, // usa la descripción real
        club: evento.discoteca?.nombre || 'Sin discoteca', // asegurarse que discoteca no sea null
        image: evento.discoteca?.imagen || '/card.png',
        mapRoute: '/mapa'
      }))
      setEvents(eventos)
    })  
    .catch(error => {
      Swal.fire('Error', 'No se pudieron cargar los eventos', 'error')
      console.error(error)
    })
}, [])


  return (
    <>
      <Header />
      <div className="eventos-container">
        {events.map(event => (
          <EventCard
            key={event.id}
            date={event.date}
            title={event.title}
            description={event.description}
            club={event.club}
            image={event.image}
            mapRoute={event.mapRoute}
          />
        ))}
      </div>
    </>
  )
}
