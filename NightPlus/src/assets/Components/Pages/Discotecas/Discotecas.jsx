import React, { useEffect, useState } from "react";  // Usamos useState y useEffect
import { Header } from '../../Header/Header'
import '../../../../Styles/Discotecas.css'


export const Discotecas = () => {
    const [discotecas, setDiscotecas] = useState([]); // Estado para almacenar las discotecas
    const [error, setError] = useState(null); // Estado para manejar errores
  
    useEffect(() => {
      // Usamos fetch para hacer una solicitud GET al backend
     fetch('https://nightplusback.vercel.app/servicio/discotecas')

        .then(response => {
          // Verificamos si la respuesta es exitosa (status 200-299)
          if (!response.ok) {
            throw new Error('No se pudo obtener la lista de discotecas');
          }
          return response.json(); // Convertimos la respuesta a JSON
        })
        .then(data => {
          // Guardamos los datos en el estado
          setDiscotecas(data);
        })
        .catch(error => {
          // Si hay un error, lo guardamos en el estado de error
          setError(error.message);
        });
    }, []); // El array vacío asegura que esto se ejecute solo una vez al cargar el componente
    return (
        <>
          <Header />
          <h1>Discotecas Disponibles</h1>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Muestra mensaje de error si existe */}
          <div className="discotecas-container">
            {discotecas.length > 0 ? (
              discotecas.map(discoteca => (
                <div className="card" key={discoteca.id}>
                  <img src={discoteca.imagen} alt={discoteca.nombre} className="card-image" />
                  <h2>{discoteca.nombre}</h2>
                  <p><strong>Ubicación:</strong> {discoteca.ubicacion}</p>
                  <p><strong>Capacidad:</strong> {discoteca.capacidad}</p>
                </div>
              ))
            ) : (
              <p>No hay discotecas disponibles.</p>
            )}
          </div>
        </>
      );
    }