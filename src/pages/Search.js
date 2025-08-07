import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/searchComponents/searchBar';
import ListingsDisplay from '../components/searchComponents/ListingView';
import styles from '../css/SearchPage.module.css';

const Search = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (searchParams) => {
    const { country, city, guests, checkIn, checkOut } = searchParams;

    const queryParams = new URLSearchParams({
      country: country || '',
      city: city || '',
      guests: guests || '0',
      checkIn: checkIn || '',
      checkOut: checkOut || '',
    }).toString();

    const apiUrl = `http://localhost:5197/api/Listing/search?${queryParams}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
    }

    navigate(`/listing/search?${queryParams}`, { replace: true });
  };

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.searchBar}>
        <SearchBar onSearch={handleSearch} />
      </div>
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <section className={styles.content}>
            <ListingsDisplay listings={listings} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;