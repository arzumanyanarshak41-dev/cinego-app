import { Route, Routes } from "react-router-dom"
import { LoginPage } from "../Pages/LoginPage/LoginPage"
import { SignUpPage } from "../Pages/SignUpPage/SignUpPage"
import { Home } from "../Pages/Home/Home"
import { Layout } from "./Layout"
import { MoviePage } from "../Pages/MoviePage/MoviePage"
import { UserPage } from "../Pages/UserPage/UserPage"

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="moviepage/:id" element={<MoviePage/>}/>
                <Route path="userpage" element={<UserPage/>}/>
            </Route>
        </Routes>
    )
}