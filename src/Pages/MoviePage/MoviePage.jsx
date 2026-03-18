import { useParams } from 'react-router-dom'
import styles from './MoviePage.module.css'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToFavorites, usersSelect } from '../../Store/UsersSlice/usersSlice'
import { supabaseHeaders, supabaseUrl } from '../../Supabase/supabase'

export const MoviePage = () => {
    const { id } = useParams()
    const [film, setFilm] = useState(null)
    const [trailerKey, setTrailerKey] = useState('')
    const trailerRef = useRef(null)
    const dispatch = useDispatch()
    const logedId = localStorage.getItem('CineGo') || null
    const users = useSelector(usersSelect)?.users
    const [user, setUser] = useState(null)
    const [cast, setCast] = useState([])

    useEffect(() => {
        const getCast = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=1eda474d8a43894c253cbeb02bd72ac4&language=en-US`
                )
                const data = await res.json()
                setCast(data.cast.slice(0, 10))
            } catch (err) {
                console.error('Error fetching cast:', err)
            }
        }

        getCast()
    }, [id])
    console.log(cast);

    useEffect(() => {
        if (logedId && users.length > 0) {
            const logedUser = users.find(el => el.id == logedId)
            setUser(logedUser)
        }
    }, [logedId, users])

    useEffect(() => {
        const getFilm = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=1eda474d8a43894c253cbeb02bd72ac4&language=en-US`
                )
                const data = await res.json()
                setFilm(data)

                const videoRes = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=1eda474d8a43894c253cbeb02bd72ac4&language=en-US`
                )
                const videoData = await videoRes.json()
                const trailer = videoData.results.find(
                    v => v.type === 'Trailer' && v.site === 'YouTube'
                )
                if (trailer) setTrailerKey(trailer.key)
            } catch (err) {
                console.error('Error fetching movie data:', err)
            }
        }
        getFilm()
    }, [id])
    async function addToMyList() {
        let updatedFavorites = []

        if (user.favorites?.includes(id)) {
            updatedFavorites = user.favorites.filter(movId => movId !== id)
        } else {
            updatedFavorites = [id, ...(user.favorites || [])]
        }
        dispatch(addToFavorites({ id: logedId, movieId: id }))
        await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${logedId}`, {
            method: "PATCH",
            headers: supabaseHeaders,
            body: JSON.stringify({
                favorites: updatedFavorites
            })
        })
    }

    if (!film) return <div className={styles.loading}>Loading...</div>

    const scrollToTrailer = () => {
        if (trailerRef.current) {
            trailerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <div className={styles.moviePage}>
            <div
                className={styles.top}
                style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${film.backdrop_path})`,
                }}
            >
                <div className={styles.overlay}></div>
                <div className={styles.infoBox}>
                    <h1>{film.title}</h1>
                    <p>{film.overview}</p>
                    <div className={styles.buttons}>
                        <button className={styles.play} onClick={scrollToTrailer}>
                            ▶ Play Trailer
                        </button>
                        {user && (
                            user?.favorites?.includes(id) ? <button className={styles.removemyList} onClick={addToMyList}>Remove From My List</button> :
                                <button className={styles.myList} onClick={addToMyList}>+ My List</button>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.trailerBox} ref={trailerRef}>
                {trailerKey ? (
                    <iframe
                        width="100%"
                        height="500"
                        src={`https://www.youtube.com/embed/${trailerKey}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={film.title}
                    />
                ) : (
                    <p className={styles.noTrailer}>No trailer available</p>
                )}
            </div>

            <div className={styles.details}>
                <div className={styles.stats}>
                    <p><strong>Rating:</strong> {film.vote_average} / 10</p>
                    <p><strong>Release Date:</strong> {film.release_date}</p>
                    <p><strong>Genres:</strong> {film.genres.map(g => g.name).join(', ')}</p>
                    <p><strong>Duration:</strong> {film.runtime} min</p>
                    <p><strong>Language:</strong> {film.original_language.toUpperCase()}</p>
                </div>
            </div>
            <h2 className={styles.castsTitle}>Casts</h2>
            <div className={styles.casts}>
                {cast?.map(el => {
                    return (
                        <div className={styles.castBox} >
                            <img src={`https://image.tmdb.org/t/p/original${el.profile_path}`} alt="" />
                            <h3>{el.original_name}</h3>
                            <p>{el.character}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}