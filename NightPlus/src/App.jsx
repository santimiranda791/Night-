import React from 'react'
import { Discotecas } from './assets/Components/Pages/Discotecas/Discotecas' 
import { Routes, Route } from 'react-router-dom'
import { PrincipalPage } from './assets/Components/Pages/PrincipalPage/PrincipalPage'
import { StartSession } from './assets/Components/Pages/StartSession/StartSession'
export const App = () => {
  return (
    <>
      <Routes>
      <Route path="/" element={<PrincipalPage />} />
        <Route path="/discotecas" element={<Discotecas />} />
        <Route path="/Login" element={<StartSession />} />
      </Routes>
    </>
  )
}