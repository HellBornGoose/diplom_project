import React from "react";
import styles from '../css/ListingProfile.module.css'
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavigationLord from "../components/profileComponents/NavigationLord";
import Calendar from "../components/listingComponents/Calendar";

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
            
            <aside className={styles.sidebar}>
                <NavigationLord />
            </aside>
            <h1 className={styles.h1} style={landLordStyle}>Оголошення</h1>
                <section className={styles.content}>
                    
                </section>
            </main>
            <Calendar />
    
            <Footer />
        </div>
    )
}

export default ListingProfile;