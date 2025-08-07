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
            <div className={styles.editIcon}>
            <Link className={styles.editLink} to="/profile/lord/edit">
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" style={landLordStyle}>
                <path d="M7.29167 30.625C6.48958 30.625 5.80319 30.3397 5.2325 29.769C4.66181 29.1983 4.37597 28.5114 4.375 27.7083V7.29167C4.375 6.48958 4.66083 5.80319 5.2325 5.2325C5.80417 4.66181 6.49056 4.37597 7.29167 4.375H16.8073C17.2934 4.375 17.658 4.52715 17.901 4.83146C18.1441 5.13576 18.2656 5.46972 18.2656 5.83333C18.2656 6.19694 18.1383 6.53139 17.8835 6.83667C17.6288 7.14194 17.2579 7.29361 16.7708 7.29167H7.29167V27.7083H27.7083V18.1927C27.7083 17.7066 27.8605 17.342 28.1648 17.099C28.4691 16.8559 28.8031 16.7344 29.1667 16.7344C29.5303 16.7344 29.8647 16.8559 30.17 17.099C30.4753 17.342 30.6269 17.7066 30.625 18.1927V27.7083C30.625 28.5104 30.3397 29.1973 29.769 29.769C29.1983 30.3406 28.5114 30.626 27.7083 30.625H7.29167ZM13.125 20.4167V16.8802C13.125 16.4913 13.1979 16.1204 13.3437 15.7675C13.4896 15.4146 13.6962 15.1049 13.9635 14.8385L26.5052 2.29688C26.7969 2.00521 27.125 1.78646 27.4896 1.64062C27.8542 1.49479 28.2188 1.42188 28.5833 1.42188C28.9722 1.42188 29.3431 1.49479 29.696 1.64062C30.049 1.78646 30.3708 2.00521 30.6615 2.29688L32.7031 4.375C32.9705 4.66667 33.1771 4.98896 33.3229 5.34188C33.4687 5.69479 33.5417 6.05306 33.5417 6.41667C33.5417 6.78028 33.4751 7.13903 33.3419 7.49292C33.2087 7.84681 32.9958 8.16861 32.7031 8.45833L20.1615 21C19.8941 21.2674 19.5844 21.4803 19.2325 21.6388C18.8806 21.7972 18.5097 21.876 18.1198 21.875H14.5833C14.1701 21.875 13.824 21.735 13.545 21.455C13.266 21.175 13.126 20.8289 13.125 20.4167ZM16.0417 18.9583H18.0833L26.5417 10.5L25.5208 9.47917L24.4635 8.45833L16.0417 16.8802V18.9583Z" />
              </svg>
            </Link>
        </div>
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