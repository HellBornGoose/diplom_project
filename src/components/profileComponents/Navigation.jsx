import React from "react";
import { Link } from "react-router-dom";
import styles from "../css/Navigation.module.css";

const Navigation = () => {
    return(
        <nav className={styles.sidebar}>
            <div className={styles.links}>
            <Link className={styles.sidelink}>
                <li>Профіль</li>
            </Link>
            <Link className={styles.sidelink}>
                <li>Збережене</li>
            </Link>
            <Link className={styles.sidelink}>
                <li>Рейтинг</li>
            </Link>
            <Link className={styles.sidelink}>
                <li>Магазин</li>
            </Link>
            <Link className={styles.sidelink}>
                <li>Скарбничка</li>
            </Link>
            <Link className={styles.sidelink}>
                <li>Пошта</li>
            </Link>
            </div>
        </nav>
    )
}

export default Navigation