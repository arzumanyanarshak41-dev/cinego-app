import { useEffect } from "react";
import styles from "./ComplitedTrue.module.css";
import xIcon from '../../Assets/Images/xIcon.png';
import ComplitedIcon from '../../Assets/Images/completeIcon.png';

export const ComplitedTrue = ({ status, setOpenMessageFalse, message }) => {
    const icon = status ? ComplitedIcon : xIcon;

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpenMessageFalse(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, [setOpenMessageFalse]);

    return (
        <div className={`${styles.notification} ${status ? styles.success : styles.error}`}>
            <img src={icon} alt={status ? "Success" : "Error"} className={styles.icon} />
            <span className={styles.message}>{message}</span>
        </div>
    );
};