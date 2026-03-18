import styles from "./NavMenu.module.css"
import LogoPNG from '../../Assets/Images/Logo.png'
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { usersSelect } from "../../Store/UsersSlice/usersSlice"
import { usersFetch } from "../../Store/UsersSlice/usersAPI"
export const NavMenu = () => {
    const navigate = useNavigate()
    const logedId = localStorage.getItem("CineGo") || null
    const users = useSelector(usersSelect)?.users
    console.log(users);
    const dispatch = useDispatch()
    const [user, setUser] = useState(null)
    useEffect(() => {
        dispatch(usersFetch())
    }, [])
    useEffect(() => {
        if (logedId && users && users.length > 0) {
            const logedUser = users.find(el => el.id.toString() === logedId)
            if (logedUser) setUser(logedUser)
        }
    }, [users])
    console.log(user);

    return (
        <nav>
            <img src={LogoPNG} alt="" onClick={() => navigate("/")} />
            <div className={styles.gid}>
                <NavLink to={"/"} className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Home</NavLink>
                <NavLink to={"/myList"} className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>My List</NavLink>
                <div className={styles.user}>
                    {user ? (
                        <div className={styles.toUserPage} onClick={() => navigate("/userpage")}>
                            <img src={user?.avatar} alt={user?.username} />
                            <p>{user?.username}</p>
                        </div>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}