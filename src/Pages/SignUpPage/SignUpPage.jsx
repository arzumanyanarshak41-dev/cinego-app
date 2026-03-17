import styles from './SignUpPage.module.css'
import LogoPng from '../../Assets/Images/Logo.png'
import man1PNG from '../../Assets/Images/boy_11.png'
import girl1PNG from '../../Assets/Images/girl_1.png'
import man2PNG from '../../Assets/Images/man_2.png'
import girl2PNG from '../../Assets/Images/girl_2.png'
import emailjs from '@emailjs/browser'
import { useEffect, useState } from 'react'
import { VerificationBox } from '../../Components/VerificationBox/VerificationBox'
import { useDispatch, useSelector } from 'react-redux'
import { usersSelect } from '../../Store/UsersSlice/usersSlice'
import { NotTrue } from '../../Components/NotTrue/NotTrue'
import { usersFetch } from '../../Store/UsersSlice/usersAPI'

const avatars = [girl1PNG, man1PNG, girl2PNG, man2PNG];

export const SignUpPage = () => {
    const [verificationBox, setverificationBox] = useState(false)
    const [email, setemail] = useState("")
    const [avatarfile, setAvatarFile] = useState()
    const users = useSelector(usersSelect)?.users
    const [notTrue, setNotTrue] = useState(false)
    const [code, setcode] = useState(null)
    const [info, setInfo] = useState('')
    const [newUser, setNewUser] = useState({})
    const dispatch = useDispatch()
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
    useEffect(() => {
        dispatch(usersFetch())
    }, [])

    function handleAvatarClick(src, index) {
        fetch(src)
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarFile(reader.result);
                    setSelectedAvatarIndex(index);
                };
                reader.readAsDataURL(blob);
            });
    }
    function onSub(e) {
        e.preventDefault();
        const isEmail = users?.some(el => el?.email === email);
        if (isEmail) {
            setInfo("Incorrect Email")
            setNotTrue(true);
            return;
        }
        if (!avatarfile) {
            setInfo("Select Avatar")
            setNotTrue(true);
            return;
        }

        const newUserObj = {
            username: e.target.usname.value.trim(),
            avatar: avatarfile,
            email: email,
            password: e.target.pass.value.trim(),
            favorites: []
        };

        const generatedCode = Math.floor(100000 + Math.random() * 900000);
        setcode(generatedCode);
        emailjs.send(
            "service_xkzzxxi",
            "template_27u2vt8",
            { email, code: generatedCode },
            "iKQzHkHFEKN0bFAet"
        )
            .then(() => {
                setNewUser(newUserObj);
                setverificationBox(true);
            })
            .catch(err => console.error(err));
    }

    return (
        <div className={styles.signUpPage}>
            {notTrue && <NotTrue info={info} />}
            <div className={styles.top}>
                <img src={LogoPng} alt="" />
            </div>
            {
                !verificationBox ? <div className={styles.signUpContainer}>
                    <h1 className={styles.title}>Create Account</h1>
                    <form className={styles.form} onSubmit={onSub}>
                        <input type="text" placeholder="Username" className={styles.input} name='usname' required />
                        <input type="email" placeholder="Email" className={styles.input} onChange={(e) => setemail(e.target.value.trim())} required />
                        <input type="password" placeholder="Password" className={styles.input} name='pass' required />

                        <div className={styles.avatars}>
                            {avatars.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`avatar ${index}`}
                                    className={styles.avatar}
                                    onClick={() => handleAvatarClick(src, index)}
                                    style={{
                                        border: selectedAvatarIndex === index ? "2px solid red" : "2px solid transparent",
                                        borderRadius: "50%",
                                    }}
                                />
                            ))}
                        </div>

                        <button type="submit" className={styles.button}>Sign Up</button>
                    </form>
                    <div className={styles.footer}>
                        <span>Already have an account? </span>
                        <a href="/login">Log in</a>
                    </div>
                </div> :
                    <VerificationBox code={code} newUser={newUser} onSub={onSub}/>
            }
        </div>
    )
}