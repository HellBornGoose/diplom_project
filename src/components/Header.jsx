import React from "react";
import './css/Header.css';
import logo2x from '../img/logo2x.png'
import ukrainianFlag from '../img/UKRflag.svg'

function Header(){
    return(
        <header>
        <div className="logo">
          <img className="logo-icon" src={logo2x} alt="logo MyRoost" />
        </div>
        <nav className="header-nav">
          <a href="#">Головна</a>
          <a href="#">Про нас</a>
          <a href="#">Житло</a>
          <a href="#">Новини</a>
          <a href="#">Контакти</a>
        <div className="flag" >
            <img src={ukrainianFlag} className="flag" alt="Ukrainian flag" />
        </div>
        </nav>
        
      </header>
    )
}

export default Header;