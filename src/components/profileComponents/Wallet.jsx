import styles from '../css/Wallet.module.css';
import visa from '../../img/VisaIcon.svg';
import mastercard from '../../img/MastercardIcon.svg';
import gpay from '../../img/GPay.svg';
import purse from '../../img/Purse.svg'; // иконка кошелька с монетками

const WalletCard = () => {
  return (
    <div className={styles.walletCard}>
      <div className={styles.walletLeft}>
        <h2>Мій гаманець</h2>
        <p className={styles.cardLabel}>Номер картки</p>
        <div className={styles.cardNumber}>3332 **** **** 2211</div>

        <p className={styles.balanceLabel}>Баланс</p>
        <p className={styles.balance}>3 550 <span className={styles.currency}>₴</span></p>

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
