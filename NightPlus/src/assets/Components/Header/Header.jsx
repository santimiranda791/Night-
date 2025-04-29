import React from 'react'
import '../../../Styles/Header.css'
import {NavLink} from 'react-router-dom'

export const Header = () => {
  return (
    <header>
     <img src="./src/assets/Icons/logito.svg" alt="Logo" className="logo" /> {/* Imagen del logo */}
        <nav className="navbar">
            <ul className="nav-list">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/Discotecas">Discotecas</NavLink></li>
            <li><NavLink to="/PrincipalPage">Eventos</NavLink></li>
            </ul>
        </nav>
    </header>
  )
}

