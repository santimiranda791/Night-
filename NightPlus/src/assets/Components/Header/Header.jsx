import React, { useState, useEffect } from 'react';
import '../../../Styles/Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

export const Header = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsuario(decoded.name || decoded.usuarioCliente || decoded.usuario || decoded.email || '');
      } catch (e) {
        setUsuario('');
      }
    } else {
      setUsuario(localStorage.getItem('nombre') || localStorage.getItem('usuario') || '');
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar sesión?',
      imageUrl: '/logitopensativo.webp',
      imageWidth: 130,
      imageHeight: 130,
      showCancelButton: true,
      confirmButtonColor: '#a374ff',
      background: '#000',
      color: '#fff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('nombre');
        localStorage.removeItem('currentAdmin');
        setUsuario('');
        setDropdownVisible(false);
        Swal.fire({
          background: '#000',
          color: '#fff',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          timer: 1200,
          showConfirmButton: false
        });
        setTimeout(() => {
          navigate('/');
        }, 1200);
      }
    });
  };

  return (
    <header className="header-container">
      <img src="/logito.svg" alt="Logo" className="logo" />
      {/* Ícono hamburguesa solo en móvil */}
      <button
        className="hamburger-btn"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Abrir menú"
      >
        <FaBars size={28} />
      </button>
      {/* Menú normal */}
      <nav className={`navbar ${mobileMenuOpen ? "open" : ""}`}>
        <ul className="nav-list">
          <li>
            <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#a374ff' : 'white', textDecoration: 'none' })}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/Discotecas" style={({ isActive }) => ({ color: isActive ? '#a374ff' : 'white', textDecoration: 'none' })}>Discotecas</NavLink>
          </li>
          <li>
            <NavLink to="/Eventos" style={({ isActive }) => ({ color: isActive ? '#a374ff' : 'white', textDecoration: 'none' })}>Eventos</NavLink>
          </li>
        </ul>
      </nav>
      <div className="user" onClick={toggleDropdown}>
        <FaUserCircle style={{ fontSize: '2rem' }} />
        <p>{usuario && usuario.trim() !== '' ? `Hola, ${usuario}` : 'Iniciar Sesión'}</p>
        {isDropdownVisible && (
          <div className="dropdown">
            {usuario ? (
              <>
                <p className="dropdown-item" onClick={handleLogout}>Cerrar sesión</p>
                <NavLink to="/Perfil" className="dropdown-item">Ver perfil</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/Login" className="dropdown-item">¿Eres Cliente?</NavLink>
                <NavLink to="/LogInAdmin" className="dropdown-item">¿Eres Admin?</NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};