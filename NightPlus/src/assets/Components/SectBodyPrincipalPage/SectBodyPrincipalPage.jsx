import React from 'react'
import '../../../Styles/SectBodyPrincipalPage.css'


export const SectBodyPrincipalPage = () => {

  const VideoBackground = "/Video.mp4";
  return (

    <>
    <div className='video-container'>
    <video autoPlay loop muted className="background-video">
        <source src={VideoBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
    
    <div className="body-container">
      
      

      <div className="content">
        <h1>Bienvenido a la página principal</h1>
        <p>Este es el contenido principal de la página con un video de fondo.</p>

        <section className="upcoming-events">
          <h2>Próximos Eventos</h2>
          <ul className="events-list">
            <li className="event-card">
              <strong>Evento 1</strong> - Fecha: 2024-07-01
              <p>Descripción breve del evento 1.</p>
            </li>
            <li className="event-card">
              <strong>Evento 2</strong> - Fecha: 2024-07-15
              <p>Descripción breve del evento 2.</p>
            </li>
            <li className="event-card">
              <strong>Evento 3</strong> - Fecha: 2024-08-05
              <p>Descripción breve del evento 3.</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
    </>
  )
}
