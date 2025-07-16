import React from "react";
import ProfileInfo from "../components/profileComponents/ProfileInfo";
import Header from "../components/Header";
import WalletCard from "../components/profileComponents/Wallet";
import Footer from '../components/Footer';
import Navigation from "../components/profileComponents/Navigation";
import styles from "../css/UserProfile.module.css"

function UserProfileView(){
return(
    <div className={styles.layout}>
        <Header />
        

        <main className={styles.main}>
            <aside className={styles.sidebar}>
                <Navigation />
            </aside>

            <section className={styles.content}>
                <ProfileInfo />
                <WalletCard />
            </section>
        </main>

    
    <Footer />
</div>


)
}

export default UserProfileView;