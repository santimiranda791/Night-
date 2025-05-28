import React, { useEffect, useState } from 'react';
import ZonaMapa from './ZonaMapa';
import Swal from 'sweetalert2';
import '../../../../Styles/MapaDiscoteca.css'; 

export const MapaDiscoteca = () => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarZonas();
  }, []);

  const cargarZonas = () => {
    setLoading(true);
    fetch('http://localhost:8080/servicio/zonas')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log('Zonas recibidas del backend:', data);
    if (Array.isArray(data)) {
      setZonas(data);
    } else {
      console.error('La respuesta no es un arreglo:', data);
      setZonas([]);
    }
  })
  .catch((error) => {
    console.error('Error al obtener las zonas:', error);
    setZonas([]);
  })
  .finally(() => {
    setLoading(false);
  });

  };

  const handleReservarMesa = (mesa) => {
    Swal.fire({
      title: `¿Reservar la mesa ${mesa.numeroMesa}?`,
      text: `Capacidad: ${mesa.capacidad} personas`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reservar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const reserva = {
          idCliente: 1, // o el id del cliente autenticado
          idMesa: mesa.idMesa || mesa.id,
          fecha: new Date().toISOString().split('T')[0], // hoy
          estado: 'Reservado'
        };

        fetch('http://localhost:8080/servicio/reservas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reserva)
        })
        .then(response => {
          if (!response.ok) throw new Error("Error al reservar la mesa.");
          Swal.fire('¡Reservado!', 'La mesa ha sido reservada exitosamente.', 'success');
          cargarZonas(); // recarga el mapa para actualizar disponibilidad
        })
        .catch(error => {
          Swal.fire('Error', 'No se pudo realizar la reserva.', 'error');
          console.error('Error en la reserva:', error);
        });
      }
    });
  };

  return (
    <div className="mapa-container">
      <h2>Mapa interactivo de zonas y mesas</h2>
      {loading ? (
        <p>Cargando zonas...</p>
      ) : (
        <div className="zonas-container">
          {Array.isArray(zonas) ? (
  zonas.map(zona => (
    <ZonaMapa key={zona.id} zona={zona} onReservar={handleReservarMesa} />
  ))
) : (
  <p>No se pudieron cargar las zonas correctamente.</p>
)
}
        </div>
      )}
    </div>
  );
};
