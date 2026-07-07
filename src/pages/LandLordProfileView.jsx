import React from "react";
import { useEffect, useRef } from 'react';
import ProfileInfo from "../components/profileComponents/ProfileInfo";
import Header from "../components/Header";
import WalletCard from "../components/profileComponents/Wallet";
import Footer from '../components/Footer';
import styles from "../css/UserProfile.module.css";
import NavigationLord from "../components/profileComponents/NavigationLord";
import { NGROK_URL } from '../Hooks/config';
import { Link } from "react-router-dom";

function LandLordProfileView({}){
    const landLordStyle = {
        color: '#E07B3B',
        borderColor: '#E07B3B',
        fill: '#E07B3B',
    };
    const landLordBorderStyle = {
        borderColor: '#E07B3B',
    }
    const landLordPhoneIconStyle = {
        stroke: '#E07B3B',
    }
    const landLordNavigationStyle = {
        backgroundColor: '#E07B3B',
    }
return(
    <div className={styles.layout}>
        <Header />
        

        <main className={styles.main}>
            <aside className={styles.sidebar}>
                <NavigationLord landLordNavigationStyle={landLordNavigationStyle}/>
            </aside>
            <div className={styles.mainContent}>
            <h1 className={styles.h1} style={landLordStyle}>Мій Профіль</h1>
            <section className={styles.content}>
                <ProfileInfo landLordStyle={landLordStyle} landLordPhoneIconStyle={landLordPhoneIconStyle}/>
                <WalletCard landLordBorderStyle={landLordBorderStyle} landLordStyle={landLordStyle}/>
            </section>
            </div>
            
        </main>

    
    <Footer />
</div>


)
}

export default LandLordProfileView;