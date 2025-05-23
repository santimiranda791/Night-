import React from 'react';
import { Routes, Route } from 'react-router-dom';


import { PrincipalPage } from './assets/Components/Pages/PrincipalPage/PrincipalPage';
import { Discotecas } from './assets/Components/Pages/Discotecas/Discotecas';
import { Eventos } from './assets/Components/Pages/Eventos/Eventos';
import { MapaDiscoteca } from './assets/Components/Pages/MapaZonas/MapaDiscoteca';
import { StartSession } from './assets/Components/Pages/StartSession/StartSession';
import { SignInCliente } from './assets/Components/Pages/SignInCliente/SignInCliente';
import { StartSessionAdmin } from './assets/Components/Pages/StartSessionAdmin/StartSessionAdmin';
import { SignInAdmin } from './assets/Components/Pages/SignInAdmin/SignInAdmin';


import { UserProfile } from './assets/Components/UserProfile/UserProfile';
import { VerifyCode } from './assets/Components/Pages/VerifyCode/VerifyCode';
import { ForgotPassword } from './assets/Components/ForgotPassword/ForgotPassword';
import { VerifyCodePassword } from './assets/Components/Pages/VerifyCode/VerifyCodePassword';
import { SectbodyAdmin } from './assets/Components/Pages/SectbodyAdmin/SectbodyAdmin';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PrincipalPage />} />
      <Route path="/discotecas" element={<Discotecas />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/mapa" element={<MapaDiscoteca />} />
      <Route path="/login" element={<StartSession />} />
      <Route path="/signincliente" element={<SignInCliente />} />
      <Route path="/loginadmin" element={<StartSessionAdmin />} />
      <Route path="/signinadmin" element={<SignInAdmin />} />
      <Route path="/perfil" element={<UserProfile />} />
      <Route path="/verifycode" element={<VerifyCode />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verify-code-password" element={<VerifyCodePassword />} />
      <Route path='/mapa' element={<MapaDiscoteca />} />
      <Route path='/PrincipalAdmin' element={<SectbodyAdmin />} />
    </Routes>
  );
};