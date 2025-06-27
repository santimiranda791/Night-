import React, { useState } from 'react';

export const ResumenCompra = ({ evento, carrito: initialCarrito, onEliminar }) => {
  const [carrito] = useState(initialCarrito); // If carrito is managed by parent, no need for useState here
                                             // If quantities are only managed here, then initialCarrito is fine
  const [cantidades, setCantidades] = useState(() =>
    initialCarrito.reduce((acc, zona, i) => ({ ...acc, [i]: zona.cantidad || 1 }), {})
  );

  const formatearPrecio = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);

  const parsearPrecio = (precioStr) =>
    parseFloat(
      precioStr
        .replace(/[^0-9,.-]+/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
    );

  const aumentarCantidad = (index) => {
    setCantidades((prev) => ({ ...prev, [index]: prev[index] + 1 }));
  };

  const disminuirCantidad = (index) => {
    if (cantidades[index] > 1) {
      setCantidades((prev) => ({ ...prev, [index]: prev[index] - 1 }));
    }
  };

  const calcularTotalZona = (index, precioUnitario) => precioUnitario * cantidades[index];

  const totalGeneral = carrito.reduce((acc, zona, i) => {
    const precioUnitario = parsearPrecio(zona.precio);
    return acc + calcularTotalZona(i, precioUnitario);
  }, 0);

  const onFinalizarCompra = async () => {
    const items = carrito.map((zona, index) => ({
      id: zona.id || String(index),
      title: zona.nombre,
      description: `Entrada para el sector ${zona.nombre} (${zona.tipo})`,
      pictureUrl: zona.imagen || "",
      quantity: cantidades[index],
      unitPrice: parsearPrecio(zona.precio),
      currencyId: "COP",
    }));

    const orderData = {
      items: items,
      total: totalGeneral,
      eventId: evento.id,
    };

    try {
      const response = await fetch('http://localhost:8080/servicio/create-mercadopago-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear preferencia de pago: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const checkoutUrl = data.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error('No se recibió una URL de checkout de Mercado Pago.');
        alert('Hubo un problema al iniciar el proceso de pago. Intenta de nuevo.');
      }

    } catch (error) {
      console.error('Error en finalizarCompra:', error);
      alert(`Error al procesar la compra: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen max-h-screen w-[360px] bg-white rounded-r-xl shadow-xl px-6 py-4 font-sans overflow-hidden">
      {/* Evento */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-1 leading-tight">{evento.titulo}</h2>
        <p className="text-sm text-gray-600 mb-1">{evento.fecha}</p>
        <p className="text-sm text-gray-600 mb-4">{evento.ubicacion}</p>

        {/* Carrito */}
        <h3 className="font-bold text-lg mb-3">🛒 Carrito ({carrito.length})</h3>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {carrito.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 shadow relative">
              <div className="text-sm text-gray-700 font-semibold">🎫 Sector:</div>
              <div className="text-base font-bold text-black mb-1">{item.nombre}</div>
              <div className="text-sm text-gray-600">{item.tipo}</div>
              <div className="text-lg font-bold text-pink-600 mt-2">{formatearPrecio(parsearPrecio(item.precio))}</div>

              <div className="flex items-center mt-3 border border-gray-300 rounded-lg w-fit">
                <button
                  className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-200"
                  onClick={() => disminuirCantidad(index)}
                >−</button>
                <span className="px-3 text-md">{cantidades[index]}</span>
                <button
                  className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-200"
                  onClick={() => aumentarCantidad(index)}
                >+</button>
              </div>

              <button
                onClick={() => onEliminar(index)}
                className="mt-2 text-sm text-red-600 flex items-center gap-1 hover:text-red-800"
              >
                🗑️ Eliminar del carrito
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-lg font-bold mb-3">
          <span>Total:</span>
          <span>{formatearPrecio(totalGeneral)}</span>
        </div>
        <button
          onClick={onFinalizarCompra}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-bold text-lg transition"
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
};