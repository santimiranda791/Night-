import React, { useEffect, useState } from 'react';
import { ZonaMapa } from './ZonaMapa';
import '../../../../Styles/MapaDiscoteca.css';

export const MapaDiscoteca = () => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/zonas') // Puerto de tu backend
      .then((response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})

      .then((data) => {
        setZonas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las zonas:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mapa-container">
      <h2 className="mapa-title">Mapa Interactivo de Zonas y Mesas</h2>

      <div className="leyenda">
        <h4>Leyenda:</h4>
      <div className="leyenda-item">
       <span className="cuadro disponible"></span> Disponible
        </div>
        <div className="leyenda-item">
          <span className="cuadro ocupada"></span> Ocupada
        </div>
       </div>
      {loading ? (
        <p className="loading">Cargando zonas...</p>
      ) : (
        <div className="zonas-wrapper">
          {zonas.map((zona) => (
            <ZonaMapa key={zona.id} zona={zona} />
          ))}
        </div>
      )}
    </div>
  );
};