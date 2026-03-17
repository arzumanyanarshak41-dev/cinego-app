import { Outlet } from "react-router-dom"
import { NavMenu } from "../Components/NavMenu/NavMenu"

export const Layout = () => {
    return (
        <div >
            <NavMenu />
            <Outlet />
        </div>
    )
}