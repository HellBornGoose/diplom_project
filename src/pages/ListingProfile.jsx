import React from "react";
import styles from '../css/ListingProfile.module.css'
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavigationLord from "../components/profileComponents/NavigationLord";
import Calendar from "../components/listingComponents/Calendar";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ListingSort from "../components/listingComponents/ListingSort";
import { NGROK_URL } from '../Hooks/config';

function ListingProfile(){
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