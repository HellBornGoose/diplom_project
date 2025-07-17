import { useState, useEffect } from 'react';
import styles from '../css/Wallet.module.css';
import visa from '../../img/VisaIcon.svg';
import mastercard from '../../img/MastercardIcon.svg';
import gpay from '../../img/GPay.svg';
import purse from '../../img/Purse.svg'; // иконка кошелька с монетками

const ngrokLink = 'https://your-ngrok-link.com'; // замени на свой адрес

const WalletCard = () => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const res = await fetch(`${ngrokLink}/api/Wallet/get-balance`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        setBalance(data.balance); // предполагаем, что сервер возвращает { balance: 3550 }
      } catch (err) {
        console.error('Error fetching balance:', err);
        //setError('Помилка при завантаженні балансу');
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className={styles.walletCard}>
      <div className={styles.walletLeft}>
        <h2>Мій гаманець</h2>
        <p className={styles.cardLabel}>Номер картки</p>
        <div className={styles.cardNumber}>3332 **** **** 2211</div>

        <p className={styles.balanceLabel}>Баланс</p>
        <p className={styles.balance}>
            {/* {balance !== null ? `${balance.toLocaleString()} ₴` : 'Завантаження...'}  */}
            3500 <span className={styles.currency}>$</span>
        </p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button className={styles.topUpBtn}>Поповнити</button>
      </div>

      <div className={styles.walletRight}>
        <div className={styles.payIcons}>
          <img src={visa} alt="Visa" />
          <img src={mastercard} alt="Mastercard" />
          <img src={gpay} alt="Google Pay" />
        </div>
        <img src={purse} alt="Purse with coins" className={styles.purseImg} />
      </div>
    </div>
  );
};

export default WalletCard;
