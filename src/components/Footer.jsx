import React from "react";
import LogoWhite from '../img/logoWhite.png';
import Xlogo from '../img/Xlogo.svg';
import FacebookLogo from '../img/FacebookLogo.svg';
import TelegramLogo from '../img/TelegramLogo.svg';
import InstLogo from '../img/Instlogo.svg';
import footerstyle from './css/Footer.module.css';

function Footer(){
    return(
    <footer className={footerstyle.footer}>
        <div className={footerstyle.footerleft}>
            <a href="#">Про сайт</a>
            <a href="#">Правила та умови</a>
            <a href="#">Часті запитання</a>
            <a href="#">Служба підтримки</a>
        </div>
        <div className={footerstyle.footerright}>
            <div className={footerstyle.footerbrand}>
            <img src={LogoWhite} alt="MyRoost logo" />
            </div>
        <p>Ми у соц мережах</p>
        <div className={footerstyle.socialicons}>
            <img src={Xlogo} alt="X" />
            <img src={InstLogo} alt="Instagram" />
            <img src={FacebookLogo} alt="Facebook" />
            <img src={TelegramLogo} alt="Telegram" />
        </div>
    </div>
</footer>
    )
}
export default Footer;