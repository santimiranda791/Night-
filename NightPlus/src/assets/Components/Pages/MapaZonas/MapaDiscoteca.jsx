import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export const MapaDiscoteca = () => {
  const [mesas, setMesas] = useState([]);

  // Cargar mesas desde backend
  const cargarMesas = () => {
    fetch('http://localhost:8080/servicio/mesas')
      .then(res => res.json())
      .then(data => setMesas(data))
      .catch(err => {
        console.error('Error al cargar mesas:', err);
        Swal.fire('Error', 'No se pudo cargar la lista de mesas', 'error');
      });
  };

  useEffect(() => {
    cargarMesas();
  }, []);

  const reservarMesa = (mesa) => {
    // Aquí deberías tener el id del cliente logueado
    const idCliente = 1; // Cambia según autenticación real

    const reserva = {
      idCliente: idCliente,
      mesa: { id: mesa.id },
      fecha: new Date().toISOString().split('T')[0], // formato yyyy-MM-dd
      estado: 'Reservado'
    };

    fetch('http://localhost:8080/servicio/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reserva)
    })
      .then(response => {
        if (!response.ok) throw new Error("No se pudo reservar la mesa");
        return response.json();
      })
      .then(data => {
        Swal.fire('¡Reservado!', `Mesa ${mesa.numeroMesa} reservada con éxito.`, 'success');
        cargarMesas(); // recarga para actualizar estado
      })
      .catch(error => {
        Swal.fire('Error', 'No se pudo realizar la reserva.', 'error');
        console.error('Error en la reserva:', error);
      });
  };

  return (
    <div>
      <h2>Mapa de Mesas</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {mesas.map(mesa => (
          <div
            key={mesa.id}
            style={{
              border: '1px solid black',
              margin: '10px',
              padding: '10px',
              width: '120px',
              textAlign: 'center',
              backgroundColor: mesa.disponible ? '#a2d5a2' : '#d5a2a2',
              cursor: mesa.disponible ? 'pointer' : 'not-allowed',
              opacity: mesa.disponible ? 1 : 0.6
            }}
            onClick={() => {
              if (mesa.disponible) {
                reservarMesa(mesa);
              }
            }}
            title={mesa.disponible ? 'Reservar mesa' : 'Mesa no disponible'}
          >
            <p><b>Mesa {mesa.numeroMesa}</b></p>
            <p>Capacidad: {mesa.capacidad}</p>
            <p>{mesa.disponible ? 'Disponible' : 'Reservada'}</p>
          </div>
        ))}
      </div>
    </div>
  );

};
