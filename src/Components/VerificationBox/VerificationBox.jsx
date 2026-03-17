import { useNavigate } from 'react-router-dom';
import { supabaseHeaders, supabaseUrl } from '../../Supabase/supabase';
import styles from './VerificationBox.module.css';
import { useEffect, useState } from 'react';
import BackArrow from '../../Assets/Images/back-arrow.png';

export const VerificationBox = ({ code, newUser }) => {
    const navigate = useNavigate();
    const [time, setTime] = useState(60);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        if (time <= 0) {
            setExpired(true);
            return;
        }
        const timer = setInterval(() => {
            setTime(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [time]);

    async function handleSubmit(e) {
        e.preventDefault();
        const inputCode = e.target.usersCode.value.trim();
        if (code == inputCode) {
            try {
                const res = await fetch(`${supabaseUrl}/rest/v1/users`, {
                    method: "POST",
                    headers: supabaseHeaders,
                    body: JSON.stringify(newUser)
                });
                if (!res.ok) throw new Error("Failed to create user");
                const result = await res.json();
                localStorage.setItem("CineGo", result[0].id);
                navigate("/login");
            } catch (err) {
                console.error(err);
                alert("Ошибка при регистрации");
            }
        } else {
            alert("Неверный код");
        }
    }

    return (
        <div className={styles.verificationBox}>
            {!expired ? (
                <form onSubmit={handleSubmit}>
                    <h2 className={styles.title}>Enter Verification Code</h2>
                    <p>code has been sent to your email</p>
                    <input
                        type="text"
                        className={styles.input}
                        name='usersCode'
                        placeholder="Enter code"
                    />
                    <button className={styles.button}>Submit</button>
                    <p>Left {time}</p>
                </form>
            ) : (
                <div className={styles.backContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                    </svg>
                    <p>Time expired. Click the arrow to go back.</p>
                </div>
            )}
        </div>
    );
};