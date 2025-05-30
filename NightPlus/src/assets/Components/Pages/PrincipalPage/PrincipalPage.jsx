import React from 'react'
import '../../../../Styles/PrincipalPage.css'
import { Header } from '../../Header/Header'
import { Footer } from '../../Footer/Footer'
import { SectBodyPrincipalPage } from '../../SectBodyPrincipalPage/SectBodyPrincipalPage'
import { SectBodyDiscotecas } from '../Discotecas/SectBodyDiscotecas'

export const PrincipalPage = () => {
  return (
    <>
      <Header/> 
      <SectBodyPrincipalPage />
      <SectBodyDiscotecas />
      <Footer /> {/* Usa el componente Footer aquí */}
    </>
  )
}