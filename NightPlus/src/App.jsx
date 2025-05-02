import React from 'react'
import { Discotecas } from './assets/Components/Pages/Discotecas/Discotecas' 
import { Routes, Route } from 'react-router-dom'
import { PrincipalPage } from './assets/Components/Pages/PrincipalPage/PrincipalPage'
import { StartSession } from './assets/Components/Pages/StartSession/StartSession'
import { SignInCliente } from './assets/Components/Pages/SignInCliente/SignInCliente'
import { StartSessionAdmin } from './assets/Components/Pages/StartSessionAdmin/StartSessionAdmin'
import { SignInAdmin } from './assets/Components/Pages/SignInAdmin/SignInAdmin'
export const App = () => {
  return (
    <>
      <Routes>
      <Route path="/" element={<PrincipalPage />} />
        <Route path="/discotecas" element={<Discotecas />} />
        <Route path="/Login" element={<StartSession />} />
        <Route path="/SignInCliente" element={<SignInCliente />} />
        <Route path="/LogInAdmin" element={<StartSessionAdmin/>} />
        <Route path="/SignInAdmin" element={<SignInAdmin />} />
      </Routes>
    </>
  )
}