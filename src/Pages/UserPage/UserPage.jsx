import { useEffect, useState } from "react";
import styles from "./UserPage.module.css";
import man1PNG from '../../Assets/Images/boy_11.png';
import girl1PNG from '../../Assets/Images/girl_1.png';
import man2PNG from '../../Assets/Images/man_2.png';
import girl2PNG from '../../Assets/Images/girl_2.png';
import { useDispatch, useSelector } from "react-redux";
import { usersSelect } from "../../Store/UsersSlice/usersSlice";
import { ComplitedTrue } from "../../Components/ComplitedTrue/ComplitedTrue";
import { supabaseHeaders, supabaseUrl } from "../../Supabase/supabase";
import { useNavigate } from "react-router-dom";
import { DeleteAccontNot } from "../../Components/DeleteAccontNot/DeleteAccontNot";

const avatars = [girl1PNG, man1PNG, girl2PNG, man2PNG];

export const UserPage = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
    const [userImage, setUserImage] = useState(null);
    const [customImage, setCustomImage] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState({ show: false, status: true, message: "" });
    const [openDeleter, setopenDeleter] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector(usersSelect)?.users;
    const logedId = localStorage.getItem("CineGo") || null;

    useEffect(() => {
        if (logedId && users && users.length > 0) {
            const logedUser = users.find(el => el.id.toString() === logedId);
            if (logedUser) {
                setUser(logedUser);
                setUsername(prev => prev || logedUser.username);
                setEmail(logedUser.email);

                if (!customImage && !userImage) {
                    setUserImage(logedUser.avatar || null);
                }
            }
        }
    }, [users, logedId, customImage, userImage]);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setUserImage(reader.result);
            setCustomImage(true);
        };
        reader.readAsDataURL(file);
    };

    const showNotification = (status, message) => {
        setNotification({ show: true, status, message });
        setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 1200);
    };

    const handleSave = async () => {
        if ((password !== "" || confirmPassword !== "")) {
            if (!password || !confirmPassword) {
                showNotification(false, "Please fill both password fields!");
                return;
            }
            if (password.length < 6) {
                showNotification(false, "Password must be at least 6 characters!");
                return;
            }
            if (password !== confirmPassword) {
                showNotification(false, "Passwords do not match!");
                return;
            }
        }

        const updatedUser = {
            username,
            email,
            avatar: customImage ? userImage : selectedAvatar,
            password: password || user?.password,
            favorites: user?.favorites || [],
            created_at: user?.created_at
        };

        console.log("User saved:", updatedUser);

        await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${user.id}`, {
            method: "PATCH",
            headers: {
                ...supabaseHeaders,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                avatar: customImage ? userImage : selectedAvatar,
                password: password || user?.password
            })
        });

        showNotification(true, "Saved!");
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <div className={styles.page}>
            {notification.show && (
                <ComplitedTrue
                    status={notification.status}
                    message={notification.message}
                    setOpenMessageFalse={() => setNotification({ ...notification, show: false })}
                />
            )}
            {openDeleter && <DeleteAccontNot setopenDeleter={setopenDeleter} id={logedId} />}
            <div className={styles.card}>
                <div className={styles.left}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={customImage && userImage ? userImage : selectedAvatar}
                            alt="avatar"
                            className={styles.avatar}
                        />
                        <label className={styles.uploadOverlay}>
                            Add Image
                            <input type="file" accept="image/*" onChange={handleUpload} />
                        </label>
                    </div>

                    <div className={styles.avatarList}>
                        {avatars.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                onClick={() => {
                                    setSelectedAvatar(img);
                                    setCustomImage(false);
                                    setUserImage(null);
                                }}
                                className={`${styles.smallAvatar} ${!customImage && selectedAvatar === img ? styles.active : ""}`}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.right}>
                    <h2 className={styles.title}>Profile</h2>
                    <div className={styles.inputs}>
                        <input
                            className={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                        <input
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                        />
                        <input
                            type="password"
                            className={styles.input}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                        />
                    </div>

                    <div className={styles.actions}>
                        <button className={`${styles.btn} ${styles.save}`} onClick={handleSave}>
                            Save
                        </button>
                        <div className={styles.row}>
                            <button className={`${styles.btn} ${styles.logout}`} onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                                navigate("/");
                            }}>Log out</button>
                            <button className={`${styles.btn} ${styles.delete}`} onClick={() => setopenDeleter(true)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};