import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes y contextos
import { LoadingAlert } from './assets/Components/LoadingAlert/LoadingAlert';
import { LoadingProvider, LoadingContext } from './Context/LoadingContext'; // Asegúrate que esta ruta sea correcta

// Importa tus páginas
import { PrincipalPage } from './assets/Components/Pages/PrincipalPage/PrincipalPage';
import { Discotecas } from './assets/Components/Pages/Discotecas/Discotecas';
import { Eventos } from './assets/Components/Pages/Eventos/Eventos';
import { MapaDiscoteca } from './assets/Components/Pages/MapaZonas/MapaDiscoteca'; // Verifica la ruta exacta
import { StartSession } from './assets/Components/Pages/StartSession/StartSession';
import { SignInCliente } from './assets/Components/Pages/SignInCliente/SignInCliente';
import { StartSessionAdmin } from './assets/Components/Pages/StartSessionAdmin/StartSessionAdmin';
import { SignInAdmin } from './assets/Components/Pages/SignInAdmin/SignInAdmin';
import { UserProfile } from './assets/Components/UserProfile/UserProfile';
import { VerifyCode } from './assets/Components/Pages/VerifyCode/VerifyCode';
import { ForgotPassword } from './assets/Components/ForgotPassword/ForgotPassword';
import { VerifyCodePassword } from './assets/Components/Pages/VerifyCode/VerifyCodePassword';
import { SectbodyAdmin } from './assets/Components/Pages/SectbodyAdmin/SectbodyAdmin';
import { ViewEvent } from './assets/Components/Pages/ViewEvent/ViewEvent';

// Importa el Header (¡VERIFICA ESTA RUTA EN TU PROYECTO!)
// Si tu Header está en 'src/assets/Components/Layout/Header/Header.jsx', usa esa ruta.
// Si está en 'src/assets/Components/Header/Header.jsx', usa esa.
import { Header } from './assets/Components/Header/Header'; // <-- POSIBLE RUTA A AJUSTAR

// Componente Wrapper para LoadingAlert
const LoadingAlertWrapper = () => {
  const { loading } = useContext(LoadingContext);
  return loading ? <LoadingAlert /> : null;
};

export const App = () => {
  console.log("App.jsx: Componente App renderizado");

  return (
    <LoadingProvider>
      {/* LoadingAlertWrapper se renderiza siempre */}
      <LoadingAlertWrapper /> 

 

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
        <Route path='/PrincipalAdmin' element={<SectbodyAdmin />} />
        <Route path="/view-event/:id" element={<ViewEvent />} /> 
      </Routes>
    </LoadingProvider>
  );
};