import React from 'react'
import { Header } from '../../Header/Header'
import '../../../../Styles/ViewEvent.css'


export const ViewEvent = () => {
  return (
    <>
      <Header/>
      <h1>Detalles del Evento</h1>
      <div className='ViewEventDiv'>
        <div className='ViewEventText'>
        
          <h2>NOCHE DE CHICAS</h2>
          <p>¡Combo de 5 Amigas NO SE COBRA COVER!</p>
          <p>Ven a encontrar una experiencia inolvidable</p>
           <div className="animated-arrow">
            <span className="arrow-body"></span>
            <span className="arrow-head"></span>
          </div>
          </div>

          <div className='imgViewEvent'>
          <img src="/card.png" alt="Evento" className="ViewEventImg" />
      </div>
      </div>

      
 
      
    </>
  )
}