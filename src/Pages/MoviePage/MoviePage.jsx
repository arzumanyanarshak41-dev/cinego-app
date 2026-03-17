import { useParams } from 'react-router-dom'
import styles from './MoviePage.module.css'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { usersSelect } from '../../Store/UsersSlice/usersSlice'

export const MoviePage = () => {
    const { id } = useParams()
    const [film, setFilm] = useState(null)
    const [trailerKey, setTrailerKey] = useState('')
    const trailerRef = useRef(null)

    const logedId = localStorage.getItem('CineGo') || null
    const users = useSelector(usersSelect)?.users
    const [user, setUser] = useState(null)

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
                            <button className={styles.myList}>+ My List</button>
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
        </div>
    )
}