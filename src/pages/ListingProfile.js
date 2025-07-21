import React from "react";
import styles from '../css/ListingProfile.module.css'
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavigationLord from "../components/profileComponents/NavigationLord";
import Calendar from "../components/listingComponents/Calendar";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ListingSort from "../components/listingComponents/ListingSort";

function ListingProfile(){
    const ngrokLink = 'http://localhost:5197';
    const refreshTimeout = useRef(null);
    const refreshJWT = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
         if (!refreshToken) {
             throw new Error('No refresh token available');
         }

        const response = await fetch(`${ngrokLink}/api/Auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

         if (!response.ok) {
             throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        const { jwtToken, refreshToken: newRefreshToken, expires } = data;

        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('expireToken', expires);

        startTokenRefreshTimer();
    };

    // Start token refresh timer
    const startTokenRefreshTimer = () => {
        const expiresInStr = localStorage.getItem('expireToken');
        if (!expiresInStr) return;

        const expiresInSec = parseInt(expiresInStr, 10);
        if (isNaN(expiresInSec) || expiresInSec <= 0) return;

        const refreshBeforeSec = 120;
        const timeoutMs = Math.max((expiresInSec - refreshBeforeSec) * 1000, 10000);

        if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

        refreshTimeout.current = setTimeout(async () => {
            try {
                await refreshJWT();
            } catch (err) {
                console.error('Error refreshing token:', err);
            }
        }, timeoutMs);
    };
    useEffect(() => {
        refreshJWT();
        return () => {
            if (refreshTimeout.current) {
                clearTimeout(refreshTimeout.current);
            }
        };
    }, []);
    const landLordNavigationStyle = {
        backgroundColor: '#E07B3B',
    }
    const landLordStyle = {
        color: '#E07B3B',
        borderColor: '#E07B3B',
        fill: '#E07B3B',
    };
    return(
    <div className={styles.layout}>
        <Header />

        <main className={styles.main}>
        <Link className={styles.topUpBtn} to="/listing/create">
              Створити
            </Link>
            <aside className={styles.sidebar}>
                <NavigationLord landLordNavigationStyle={landLordNavigationStyle}/>
            </aside>
            <div className={styles.mainContent}>
            <h1 className={styles.h1} style={landLordStyle}>Оголошення</h1>
            <section className={styles.content}>
                <ListingSort />
            </section>
            </div>
        </main>
        <div className={styles.calendarContainer}>
        <Calendar />
        </div>
    <Footer />
    </div>
    )
}

export default ListingProfile;