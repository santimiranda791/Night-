import React, { useEffect, useState } from 'react';
import ZonaMapa from './ZonaMapa';
import '../../../../Styles/MapaDiscoteca.css'; 

export const MapaDiscoteca = () => {
  const [zonas, setZonas] = useState([]);

  useEffect(() => {

    fetch('http://localhost:8080/api/zonas')
      .then(response => response.json())
      .then(data => setZonas(data))
      .catch(error => console.error('Error al cargar zonas:', error));

    fetch('http://localhost:8080/api/zonas') 
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
      <h2>Mapa interactivo de zonas y mesas</h2>
      <div className="zonas-container">
        {zonas.map(zona => (
          <ZonaMapa key={zona.idZona} zona={zona} />
        ))}
      </div>
    </div>
  );
};

export default MapaDiscoteca;