import React from 'react'
import { PrincipalPage } from './assets/Components/Pages/PrincipalPage/PrincipalPage'
import { Discotecas } from './assets/Components/Pages/Discotecas/Discotecas' // Importa el componente Discotecas
import { Routes, Route } from 'react-router-dom'

export const App = () => {
  return (
    <>
      <PrincipalPage />
      <Routes>
        <Route path="/discotecas" element={<Discotecas />} /> {/* Usa el componente importado */}
      </Routes>
    </>
  )
}