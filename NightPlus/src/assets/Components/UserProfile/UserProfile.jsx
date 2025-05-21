import React from 'react';
import '../../../Styles/UserProfile.css';
import { NavLink, useNavigate } from 'react-router-dom';

export const UserProfile = () => {
    const navigate = useNavigate();
  const user = {
    nombre: 'Ana Gómez',
    email: 'ana.gomez@example.com',
    ubicacion: 'Ciudad de México, México',
    avatar: 'https://i.pravatar.cc/150?img=47',
    portada: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80',
    eventosProximos: [
      {
        id: 1,
        nombre: 'Concierto de Rock',
        fecha: '2024-07-15',
        lugar: 'Auditorio Nacional',
      },
      {
        id: 2,
        nombre: 'Fiesta Electrónica',
        fecha: '2024-08-05',
        lugar: 'Club Nocturno XYZ',
      },
      {
        id: 3,
        nombre: 'Festival de Jazz',
        fecha: '2024-09-12',
        lugar: 'Parque Central',
      },
    ],
  };

  const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-portada">
          <img src={user.portada} alt="Foto de portada" />
        </div>
        <div className="perfil-avatar">
          <img src={user.avatar} alt="Avatar usuario" />
        </div>
        <div className="perfil-info-botones">
          <div className="perfil-info-principal">
            <h1 className="perfil-nombre">{user.nombre}</h1>
            <p className="perfil-ubicacion">{user.ubicacion}</p>
            <p className="perfil-email">{user.email}</p>
          </div>
          <div className="perfil-botones">
            <button className="btn btn-gradient">Mis Eventos</button>
            <button className="btn btn-gradient">Mis Boletas</button>
            <button className="btn btn-outline">Editar Perfil</button>
          </div>
        </div>
      </div>

      <div className="perfil-eventos">
        <h2>Próximos Eventos</h2>
        <ul className="eventos-lista">
          {user.eventosProximos.map(({ id, nombre, fecha, lugar }) => (
            <li key={id} className="evento-item" tabIndex={0}>
              <div className="evento-info">
                <span className="evento-nombre">{nombre}</span>
                <span className="evento-detalles">
                  {new Date(fecha).toLocaleDateString('es-ES', opcionesFecha)} — {lugar}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};



