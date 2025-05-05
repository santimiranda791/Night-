import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from '../../Header/Header'

export const Discotecas = () => { const [discotecas, setDiscotecas] = useState([]);

  useEffect(() => {
    
    axios.get('http://localhost:8080/api/discotecas-list')
      .then(response => {
        setDiscotecas(response.data); 
      })
      .catch(error => {
        console.error('Hubo un error al obtener las discotecas!', error);
      });
  }, []); 

  return (
    <>
    <Header/>
    <div>
      <h1>Lista de Discotecas</h1>
      <ul>
        {discotecas.map(discoteca => (
          <li key={discoteca.id}>
            {discoteca.nombre} - {discoteca.direccion} (Capacidad: {discoteca.capacidad})
          </li>
        ))}
      </ul>
    </div>
    </>
    
  );
};