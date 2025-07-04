import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CompraExitosa = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Procesando tu compra...");

  // Define la URL base de tu backend desplegado en Railway
  const BASE_URL = 'https://backendnight-production.up.railway.app'; // <--- ¡URL ACTUALIZADA AQUÍ!

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const collectionId = queryParams.get('collection_id');
    const preferenceId = queryParams.get('preference_id');
    const externalReference = queryParams.get('external_reference'); // Mercado Pago devuelve este


    console.log("Mercado Pago Redirect - Status:", status);
    console.log("Mercado Pago Redirect - Collection ID:", collectionId);
    console.log("Mercado Pago Redirect - Preference ID:", preferenceId);
    console.log("Mercado Pago Redirect - External Reference:", externalReference);


    if (status === 'approved') {
      const confirmReservation = async () => {
        try {
          // Usa la URL base para construir la URL completa del endpoint
          const response = await fetch(`${BASE_URL}/servicio/confirmar-reserva`, { // <--- URL ACTUALIZADA
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              collectionId: collectionId,
              status: status,
              preferenceId: preferenceId,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al confirmar la reserva en el backend: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          setMessage("¡Compra exitosa y reserva confirmada!");
          Swal.fire({
            imageUrl: '/logitonegro.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "¡Compra Exitosa!",
            text: `Tu reserva (ID: ${data.idReserva}) ha sido confirmada y aparecerá en el panel de administración.`,
            confirmButtonText: "Ir a Mis Reservas",
            allowOutsideClick: false,
          }).then(() => {
            navigate('/mis-reservas');
          });

        } catch (error) {
          setMessage(`Error al procesar la confirmación: ${error.message}`);
          console.error("Error en CompraExitosa al confirmar reserva:", error);
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "Error al Confirmar Reserva",
            text: `Hubo un problema al finalizar tu reserva: ${error.message}`,
            confirmButtonText: "Entendido",
          });
          navigate('/carrito');
        } finally {
          setLoading(false);
        }
      };

      confirmReservation();

    } else if (status === 'pending') {
      setMessage("Tu pago está pendiente de aprobación. Te notificaremos cuando se confirme.");
      setLoading(false);
      Swal.fire({
        imageUrl: '/logitopensativo.webp',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: "Pago Pendiente",
        text: "Tu pago está siendo procesado. Te notificaremos cuando se confirme.",
        confirmButtonText: "Entendido",
      }).then(() => {
        navigate('/mis-reservas');
      });
    } else {
      setMessage("Tu pago ha sido rechazado o no se pudo completar.");
      setLoading(false);
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: "Pago Rechazado",
        text: "Tu pago no pudo ser procesado. Intenta de nuevo o con otro método.",
        confirmButtonText: "Volver al Carrito",
      }).then(() => {
        navigate('/carrito');
      });
    }
  }, [location, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px', color: '#fff', background: '#18122B', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Estado de la Compra</h2>
      {loading ? (
        <p>{message}</p>
      ) : (
        <p>{message}</p>
      )}
      <div style={{ marginTop: '20px' }}>
      </div>
    </div>
  );
};

export default CompraExitosa;
