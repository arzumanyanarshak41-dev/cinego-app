import styles from "./NotTrue.module.css";
import { useEffect, useState } from "react";

export const NotTrue = ({ info }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 1300);
        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className={styles.notTrueContainer}>
            ✖️ {info}
        </div>
    );
};