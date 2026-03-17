import { useNavigate } from 'react-router-dom';
import { supabaseHeaders, supabaseUrl } from '../../Supabase/supabase';
import styles from './DeleteAccontNot.module.css';

export const DeleteAccontNot = ({ setopenDeleter, id }) => {
    const navigate = useNavigate()
    async function onDelete() {
        await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${id}`, {
            method: "DELETE",
            headers: supabaseHeaders
        })
        navigate("/")
    }
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Delete Account?</h2>
                <p className={styles.message}>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className={styles.actions}>
                    <button className={styles.cancel} onClick={() => setopenDeleter(false)}>Cancel</button>
                    <button className={styles.accept} onClick={onDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};