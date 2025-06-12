import React from 'react';

export const ResumenCompra = ({ evento, carrito, total, onEliminar, onFinalizarCompra }) => {
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
              <div className="text-lg font-bold text-pink-600 mt-2">${item.precio.toLocaleString()}</div>

              <div className="flex items-center mt-3 border border-gray-300 rounded-lg w-fit">
                <button
                  className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-200"
                  onClick={() => item.setCantidad(item.cantidad > 1 ? item.cantidad - 1 : 1)}
                >−</button>
                <span className="px-3 text-md">{item.cantidad}</span>
                <button
                  className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-200"
                  onClick={() => item.setCantidad(item.cantidad + 1)}
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
          <span>${total.toLocaleString()}</span>
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
