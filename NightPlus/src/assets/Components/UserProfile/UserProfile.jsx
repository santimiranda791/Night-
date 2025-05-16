import React from 'react';
import '../../../Styles/UserProfile.css';
import { NavLink, useNavigate } from 'react-router-dom';


export const UserProfile = () => {
    const navigate = useNavigate();
    return (
        <div className="profile-container">
            <h1 className="profile-title">Perfil de Usuario</h1>
            <div className="profile-info">
                <img className="profile-img" src="/18.png" alt="Perfil" />
                <div className="profile-details">
                    <h2>Nombre: Jane Doe</h2>
                    <p>Email: jane.doe@example.com</p>
                    <p>Eventos Asistidos: 5</p>
                </div>
            </div>
        </div>
    );
};


