import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/searchComponents/searchBar';
import ListingDetails from '../components/searchComponents/ListingDetails';
import styles from '../css/SearchPage.module.css';
import { NGROK_URL } from '../Hooks/config';
import SearchDescription from '../components/searchComponents/Description';

const ListingLook = () => {
  const { listingId } = useParams();
  const location = useLocation();
  const searchParams = location.state?.searchParams || {};
  const [listing, setListing] = useState(null);
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Listing ID in ListingLook:', listingId); // Отладка

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        setError('ID оголошення не вказано');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${NGROK_URL}/api/listing/${listingId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Fetched listing data:', data);
        setDescription(data.description || '');
        setAmenities(data.amenities || []);
        setListing(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError(err.message || 'Помилка при завантаженні оголошення');
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.searchBar}>
        <SearchBar />
      </div>
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <section className={styles.content}>
            <ListingDetails searchParams={searchParams} listing={listing} />
            <SearchDescription onDescriptionChange={setDescription}
              initialValue={description}/>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingLook;