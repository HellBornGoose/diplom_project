import react from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/searchComponents/searchBar";
import styles from "../css/SearchPage.module.css"

const Search = () =>{
    return(
        <div className={styles.layout}>
        <Header />
        
        <SearchBar />
        <main className={styles.main}>
            
            <div className={styles.mainContent}>
            <section className={styles.content}>
                
            </section>
            </div>
        </main>

    
    <Footer />
</div>
    );
};

export default Search;