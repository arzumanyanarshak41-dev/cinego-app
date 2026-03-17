import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from './LoginPage.module.css'
import { supabaseHeaders, supabaseUrl } from '../../Supabase/supabase'
import LogoPNG from '../../Assets/Images/Logo.png'
export const LoginPage = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
                method: "GET",
                headers: supabaseHeaders
            })
            const data = await res.json()

            if (!data || data.length === 0) {
                setError("User not found")
                return
            }

            const user = data[0]

            if (user.password !== password) {
                setError("Incorrect password")
                return
            }
            localStorage.setItem("CineGo", user.id)

            navigate("/")
        } catch (err) {
            console.error(err)
            setError("Something went wrong")
        }
    }

    return (
        <div className={styles.login}>
            <div className={styles.top}>
                <img src={LogoPNG} alt="" />
            </div>
            <div className={styles.loginContainer}>
                <form className={styles.form} onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className={styles.button}>Login</button>
                    {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
                </form>
                <div className={styles.footer}>
                    <span>Don't have an account? </span>
                    <a href="/signup">Sign up</a>
                </div>
            </div>
        </div>
    )
}