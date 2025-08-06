import React from "react";
import { useEffect, useRef } from 'react';
import ProfileInfo from "../components/profileComponents/ProfileInfo";
import Header from "../components/Header";
import WalletCard from "../components/profileComponents/Wallet";
import Footer from '../components/Footer';
import Navigation from "../components/profileComponents/Navigation";
import styles from "../css/UserProfile.module.css";
import { NGROK_URL } from '../Hooks/config';

function UserProfileView(){
    
return(
    <div className={styles.layout}>
        <Header />
        

        <main className={styles.main}>
            
            <aside className={styles.sidebar}>
                <Navigation />
            </aside>
            <div className={styles.mainContent}>
            <h1 className={styles.h1}>Мій Профіль</h1>
            <section className={styles.content}>
                <ProfileInfo />
                <WalletCard />
            </section>
            </div>
        </main>

    
    <Footer />
</div>


)
}

export default UserProfileView;