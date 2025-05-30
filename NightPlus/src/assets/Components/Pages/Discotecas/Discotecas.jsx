import React, { useEffect, useState } from "react";  // Usamos useState y useEffect
import { Header } from '../../Header/Header'
import { SectBodyDiscotecas } from './SectBodyDiscotecas'
import '../../../../Styles/Discotecas.css'


export const Discotecas = () => {
   
    return (
        <>
          <Header />
         <SectBodyDiscotecas />
        </>
      );
    }