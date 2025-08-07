import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/searchComponents/searchBar';
import ListingsDisplay from '../components/searchComponents/ListingView';
import styles from '../css/SearchPage.module.css';
import ListingDetails from '../components/searchComponents/ListingDetails';

const ListingLook = () => {
    const { listingId } = useParams(); // Извлекаем ID из URL
    const location = useLocation();
    const searchParams = location.state?.searchParams || {}; // Извлекаем параметры из state

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.searchBar}>
        <SearchBar />
      </div>
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <section className={styles.content}>
            <ListingDetails />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingLook ;