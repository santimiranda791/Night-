import React, { useState } from 'react';
import '../../../Styles/UserProfile.css';

export const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('miCuenta');

  const user = {
    nombre: 'Santi Miranda',
    seguidores: 0,
    siguiendo: 0,
    avatar: 'https://i.pravatar.cc/150?img=12',
    portada: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80',
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="perfil-container">
      <div className="perfil-portada" style={{ backgroundImage: `url(${user.portada})` }}>
        <div className="overlay"></div>
        <div className="perfil-header-content">
          <div className="perfil-avatar">
            <img src={user.avatar} alt="Avatar usuario" />
          </div>
          <div className="perfil-nombre-seguidores">
            <h1>{user.nombre}</h1>
            <p>{user.seguidores} Seguidores • {user.siguiendo} Siguiendo</p>
          </div>
        </div>
      </div>

      <nav className="perfil-nav">
        <button
          className={activeTab === 'miCuenta' ? 'active' : ''}
          onClick={() => handleTabClick('miCuenta')}
        >
          Mi Cuenta
        </button>
        <button
          className={activeTab === 'perfil' ? 'active' : ''}
          onClick={() => handleTabClick('perfil')}
        >
          Perfil
        </button>
        <button
          className={activeTab === 'eventos' ? 'active' : ''}
          onClick={() => handleTabClick('eventos')}
        >
          Eventos
        </button>
        <button
          className={activeTab === 'miWallet' ? 'active' : ''}
          onClick={() => handleTabClick('miWallet')}
        >
          Mi Wallet
        </button>
        <button
          className={activeTab === 'misOrdenes' ? 'active' : ''}
          onClick={() => handleTabClick('misOrdenes')}
        >
          Mis Órdenes
        </button>
        <button
          className={activeTab === 'misDirecciones' ? 'active' : ''}
          onClick={() => handleTabClick('misDirecciones')}
        >
          Mis Direcciones
        </button>
        <button
          className={activeTab === 'misSuscripciones' ? 'active' : ''}
          onClick={() => handleTabClick('misSuscripciones')}
        >
          Mis Suscripciones
        </button>
      </nav>

      <div className="perfil-content">
        {activeTab === 'miCuenta' && (
          <section>
            <h2>Cuenta</h2>
            <p>Mira y edita tu información personal.</p>
            <div className="form-group">
              <label>Nombre visible *</label>
              <input type="text" defaultValue={user.nombre} />
            </div>
            <div className="form-group">
              <label>Título</label>
              <input type="text" />
            </div>
            <div className="form-buttons">
              <button className="btn-descartar">Descartar</button>
              <button className="btn-actualizar">Actualizar información</button>
            </div>
          </section>
        )}
        {activeTab === 'perfil' && (
          <section>
            <h2>Perfil</h2>
            <p>Información adicional del perfil.</p>
          </section>
        )}
        {activeTab === 'eventos' && (
          <section>
            <h2>Eventos</h2>
            <p>Lista de eventos próximos.</p>
          </section>
        )}
        {activeTab === 'miWallet' && (
          <section>
            <h2>Mi Wallet</h2>
            <p>Información de la wallet.</p>
          </section>
        )}
        {activeTab === 'misOrdenes' && (
          <section>
            <h2>Mis Órdenes</h2>
            <p>Historial de órdenes.</p>
          </section>
        )}
        {activeTab === 'misDirecciones' && (
          <section>
            <h2>Mis Direcciones</h2>
            <p>Direcciones guardadas.</p>
          </section>
        )}
        {activeTab === 'misSuscripciones' && (
          <section>
            <h2>Mis Suscripciones</h2>
            <p>Información de suscripciones.</p>
          </section>
        )}
      </div>
    </div>
  );
};
