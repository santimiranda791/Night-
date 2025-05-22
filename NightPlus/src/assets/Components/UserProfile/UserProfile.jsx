import React from 'react';
import '../../../Styles/UserProfile.css';
import { NavLink, useNavigate } from 'react-router-dom';

export const UserProfile = () => {
    const navigate = useNavigate();
    const user = {
        nombre: 'Ana Gómez',
        email: 'ana.gomez@example.com',
        ubicacion: 'Armenia, Colombia',
        avatar: 'https://i.pravatar.cc/150?img=47',
        portada: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80',
        eventosProximos: [
            {
                id: 1,
                nombre: 'Concierto de Rock',
                fecha: '2024-07-15',
                lugar: 'Auditorio Nacional',
                imagen: 'https://images.unsplash.com/photo-1511752462570-1c4c1c1c1c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHJvY2t8ZW58MHx8fHwxNjYyMjY0MjY0&ixlib=rb-1.2.1&q=80&w=400'
            },
            {
                id: 2,
                nombre: 'Fiesta Electrónica',
                fecha: '2024-08-05',
                lugar: 'Club Nocturno XYZ',
                imagen: 'https://images.unsplash.com/photo-1506748686214-e9b1c1c1c1c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGVsZWN0cm9uaWN8ZW58MHx8fHwxNjYyMjY0MjY0&ixlib=rb-1.2.1&q=80&w=400'
            },
            {
                id: 3,
                nombre: 'Festival de Jazz',
                fecha: '2024-09-12',
                lugar: 'Parque Central',
                imagen: 'https://images.unsplash.com/photo-1506748686214-e9b1c1c1c1c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGphemV8ZW58MHx8fHwxNjYyMjY0MjY0&ixlib=rb-1.2.1&q=80&w=400'
            },
        ],
    };

    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };

    return (
    <div className="perfil-container">
        <div className="sidebar">
            <h2>Opciones</h2>
            <button className="btn">Mis Eventos</button>
            <button className="btn">Mis Boletas</button>
            <button className="btn">Editar Perfil</button>
        </div>
        <div className="perfil-main">
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
                </div>
            </div>

            <div className="perfil-eventos">
                <h2>Próximos Eventos</h2>
                <ul className="eventos-lista">
                    {user.eventosProximos.map(({ id, nombre, fecha, lugar, imagen }) => (
                        <li key={id} className="evento-item" tabIndex={0}>
                            <img src={imagen} alt={nombre} className="evento-imagen" />
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
    </div>
);

};
