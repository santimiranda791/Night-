import React from 'react'
import { Header } from '../../Header/Header'
import { EventCard } from '../../EventCard/EventCard'

const events = [
  {
    id: 1,
    date: 'VIERNES 09 MAYO',
    title: 'Noche de Chicas',
    description: 'Evento Oficial De Chicas: ¡Combo de 5 Amigas NO SE COBRA COVER!',
    club: 'Discoteca Tropikal-Club',
    image: '/card.png',
    mapRoute: '/mapa'
  },
  // Puedes agregar más eventos aquí
]

export const Eventos = () => {
  return (
    <>
      <Header />
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
    </>
  )
}
