import React from 'react';
import '../../../Styles/Header.css';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

export const Header = () => {
  return (
    <header>
      <img src="./src/assets/Icons/logito.svg" alt="Logo" className="logo" /> {/* Imagen del logo */}
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
              to="/PrincipalPage" 
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

      <div className="user">
       
          <FaUserCircle style={{ fontSize: '2rem' }} /> 
          <p>Iniciar Sesión</p>  
       
        <div className="dropdown">
  <NavLink to="/Login" className="dropdown-item">¿Eres Cliente?</NavLink>
  <NavLink to="/LogInAdmin" className="dropdown-item">¿Eres Admin?</NavLink>
</div>
      </div>
    </header>
  );
};