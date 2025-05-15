import React, { useState, useEffect } from 'react';
import '../../../Styles/Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

export const Header = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUsuario(localStorage.getItem('usuario') || '');
    setNombre(localStorage.getItem('nombre') || '');
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('nombre');
    setUsuario('');
    setNombre('');
    setDropdownVisible(false);
    navigate('/');
  };

  return (
    <header>
      <img src="/logito.svg" alt="Logo" className="logo" />      
      <nav className="navbar">
        <ul className="nav-list">
          <li>
            <NavLink 
              to="/" 
              style={({ isActive }) => ({
                color: isActive ? '#a374ff' : 'white',
                textDecoration: 'none',
              })}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/Discotecas" 
              style={({ isActive }) => ({
                color: isActive ? '#a374ff' : 'white',
                textDecoration: 'none',
              })}
            >
              Discotecas
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/Eventos" 
              style={({ isActive }) => ({
                color: isActive ? '#a374ff' : 'white',
                textDecoration: 'none',
              })}
            >
              Eventos
            </NavLink>
          </li>
        </ul>
      </nav>
              
      <div className="user" onClick={toggleDropdown}>
        <FaUserCircle style={{ fontSize: '2rem' }} />
     
<p>
  {usuario ? `Hola, ${usuario}` : 'Iniciar Sesión'}
</p>  


        {isDropdownVisible && (
          <div className="dropdown">
            {usuario ? (
              <p className="dropdown-item" onClick={handleLogout}>Cerrar sesión</p>
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