import { useDispatch, useSelector } from 'react-redux'
import styles from './MyList.module.css'
import { usersSelect } from '../../Store/UsersSlice/usersSlice'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cinegoLogo from '../../Assets/Images/Logo.png'
export const MyList = () => {
    const logedId = localStorage.getItem('CineGo') || null
    const users = useSelector(usersSelect)?.users
    const dispatch = useDispatch()
    const [MyMovies, setMyMovies] = useState([])
    const filmsRef = useRef(null)
    const user = users?.find(u => u.id == logedId)
    const [randomFilm, setRandomFilm] = useState(null);
    const navigate = useNavigate()
    useMemo(() => {
        if (MyMovies?.length > 0 && !randomFilm) {
            setRandomFilm(MyMovies[Math.floor(Math.random() * MyMovies.length)]);
        }
    }, [MyMovies, randomFilm]);
    useEffect(() => {
        if (!user?.favorites?.length) {
            setMyMovies([])
            return
        }

        const fetchMovies = async () => {
            const movies = []
            for (let id of user.favorites) {
                try {
                    const res = await fetch(
                        `https://api.themoviedb.org/3/movie/${id}?api_key=1eda474d8a43894c253cbeb02bd72ac4&language=en-US`
                    )
                    const movie = await res.json()
                    movies.push(movie)
                } catch (err) {
                    console.error(`Error fetching movie ${id}:`, err)
                }
            }
            setMyMovies(movies)
        }

        fetchMovies()
    }, [user])
    console.log(MyMovies);
    const scrollToCatalog = () => {
        if (filmsRef.current) {
            filmsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }
    if (!user) {
        return (
            <div className={styles.noUser}>
                <h2>You're not logged in</h2>
                <p>Please log in to view your movies list.</p>
                <button
                    className={styles.loginBtn}
                    onClick={() => navigate("/login")}
                >
                    Go to Login
                </button>
            </div>
        )
    }
    if (!user?.favorites?.length) {
        return (
            <div className={styles.nonMovies}>
                <img
                    src={cinegoLogo}
                    className={styles.nonMoviesImg}
                />
                <h1>No Selected Films</h1>
                <p>Go to the catalog and add your favorite movies to see them here.</p>
                <button onClick={() => navigate("/")}>Browse Movies</button>
            </div>
        )
    }
    return (
        <div className={styles.MyList}>
            <div className={styles.top} style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${randomFilm?.backdrop_path})`,
            }}>
                <div className={styles.overlay}></div>
                <div className={styles.leftSide}>
                    <h1>{randomFilm?.title || "Here You Can Watch Movie Trailers"}</h1>
                    <p>{randomFilm?.overview}</p>
                    <div className={styles.buts}>
                        <button className={styles.play} onClick={() => navigate(`/moviepage/${randomFilm.id}`)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                            </svg>
                        </button>
                        <button onClick={scrollToCatalog}>Open Catalog</button>
                    </div>
                </div>
                <div className={styles.rightSide} style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${randomFilm?.backdrop_path})` }}>
                    <div className={styles.rightTop}>
                        <h2>{randomFilm?.title}</h2>
                        <p>{randomFilm?.vote_average}</p>
                    </div>
                </div>
            </div>
            <div className={styles.films} ref={filmsRef}>
                {MyMovies?.map(el => {
                    return (
                        <div className={styles.film} onClick={() => navigate(`/moviepage/${el.id}`)}>
                            <img src={`https://image.tmdb.org/t/p/w200${el?.poster_path}`} alt="" />
                            <div className={styles.info}>
                                <p className={styles.title}>{el.title}</p>
                                <p>{el?.release_date.slice(0, 4)}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}