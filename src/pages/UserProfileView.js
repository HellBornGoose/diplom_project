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
    // const refreshTimeout = useRef(null);
    // const refreshJWT = async () => {
    //     const refreshToken = localStorage.getItem('refreshToken');
    //      if (!refreshToken) {
    //          throw new Error('No refresh token available');
    //      }

    //     const response = await fetch(`${NGROK_URL}/api/Auth/refresh`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ refreshToken })
    //     });

    //      if (!response.ok) {
    //          throw new Error('Failed to refresh token');
    //     }

    //     const data = await response.json();
    //     const { jwtToken, refreshToken: newRefreshToken, expires } = data;

    //     localStorage.setItem('jwtToken', jwtToken);
    //     localStorage.setItem('refreshToken', newRefreshToken);
    //     localStorage.setItem('expireToken', expires);

    //     startTokenRefreshTimer();
    // };

    // // Start token refresh timer
    // const startTokenRefreshTimer = () => {
    //     const expiresInStr = localStorage.getItem('expireToken');
    //     if (!expiresInStr) return;

    //     const expiresInSec = parseInt(expiresInStr, 10);
    //     if (isNaN(expiresInSec) || expiresInSec <= 0) return;

    //     const refreshBeforeSec = 120;
    //     const timeoutMs = Math.max((expiresInSec - refreshBeforeSec) * 1000, 10000);

    //     if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    //     refreshTimeout.current = setTimeout(async () => {
    //         try {
    //             await refreshJWT();
    //         } catch (err) {
    //             console.error('Error refreshing token:', err);
    //         }
    //     }, timeoutMs);
    // };
    // useEffect(() => {
    //     refreshJWT();
    //     return () => {
    //         if (refreshTimeout.current) {
    //             clearTimeout(refreshTimeout.current);
    //         }
    //     };
    // }, []);
    
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