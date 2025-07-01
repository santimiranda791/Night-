import React from 'react'
import '../../../../Styles/PrincipalPage.css'
import { Header } from '../../Header/Header'
import { Footer } from '../../Footer/Footer'
import { SectBodyPrincipalPage } from '../../SectBodyPrincipalPage/SectBodyPrincipalPage'
import { SectBodyBuzonResenas } from '../../SectBodyBuzonResenas/SectBodyBuzonResenas'

export const PrincipalPage = () => {
  return (
    <>
      <Header/> 
      <SectBodyPrincipalPage />
      <SectBodyBuzonResenas nitDiscoteca={1} />
      <Footer /> {/* Usa el componente Footer aquí */}
    </>
  )
}
