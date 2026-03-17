import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './Home.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { moviesSelect } from '../../Store/MoviesSlice/moviesSlice'
import { moviesFetch } from '../../Store/MoviesSlice/moviesAPI'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
    const [page, setPage] = useState(1)
    const { movies, loading } = useSelector(moviesSelect)
    const [searchResult, setSearchResult] = useState([])
    const navigate = useNavigate()
    const filmsRef = useRef(null)
    const dispatch = useDispatch()
    const [randomFilm, setRandomFilm] = useState(null);

    useEffect(() => {
        dispatch(moviesFetch(page))
    }, [page])
    useMemo(() => {
        if (movies.length > 0 && !randomFilm) {
            setRandomFilm(movies[Math.floor(Math.random() * movies.length)]);
        }
    }, [movies, randomFilm]);
    if (loading) return (
        <div className={styles.loading}>
            <span className={styles.loadingCircle}></span>
        </div>
    )
    const scrollToCatalog = () => {
        if (filmsRef.current) {
            filmsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }
    let timer;
    const searchMovie = (title) => {
        clearTimeout(timer)
        timer = setTimeout(async () => {
            if (!title) {
                setSearchResult([])
                return
            }
            const res = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=1eda474d8a43894c253cbeb02bd72ac4&query=${encodeURIComponent(title)}`
            )
            const data = await res.json()
            setSearchResult(data.results)
        }, 400)
    }


    return (
        <div className={styles.home}>
            <div className={styles.top} style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${randomFilm?.backdrop_path})`,
            }}>
                <div className={styles.overlay}></div>
                <div className={styles.leftSide}>
                    <h1>{randomFilm?.title || "Here You Can Watch Movie Trailers"}</h1>
                    <p>{randomFilm?.overview}</p>
                    <div className={styles.buts}>
                        <button className={styles.play} onClick={()=>navigate(`/moviepage/${randomFilm.id}`)}>
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

            <div className={styles.search}>
                <input
                    type="search"
                    name="search"
                    placeholder="Search Movies or Serials By Title"
                    onChange={(e) => searchMovie(e.target.value.trim())}
                />

                {searchResult.length > 0 && (
                    <div className={styles.searchResults} >
                        {searchResult.map(movie => (
                            <div key={movie.id} className={styles.movieCard} onClick={() => navigate(`/moviepage/${movie.id}`)}>
                                <img
                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/placeholder.png'}
                                    alt={movie.title}
                                />
                                <div>
                                    <h3>{movie.title}</h3>
                                    <p>{movie.release_date?.slice(0, 4)}</p>
                                    <p>⭐ {movie.vote_average}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.films} ref={filmsRef}>
                {movies.map(el => {
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
            <div className={styles.pagination}>
                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <span>Page {page}</span>
                <button
                    onClick={() => setPage(prev => prev + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    )
}