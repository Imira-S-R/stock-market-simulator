import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_img.png";

export default function NavbarComponent({isLoggedIn, setIsLoggedIn}) {
    const navigate = useNavigate()

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/google`
    }


    const handleGoogleLogout = () => {
        const logout = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, { credentials: 'include' })
            if (res.ok) {
                setIsLoggedIn(false)
                navigate('/')
            }
        }
        logout()
    }

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/check_user`, { credentials: 'include' })

            if (res.ok) {
                setIsLoggedIn(true)
            }
            console.log(res)
        }

        checkAuth()
    }, [])

    return (
        <div className="flex justify-between items-center text-white px-3 max-w-[1100px] mx-auto pt-4 absolute top-0 right-0 left-0">
            {isLoggedIn ? <Link to='/dashboard'><div className="flex items-center"><img src={logo} className="w-[40px] "/><h1 className="text-2xl hidden sm:inline">Purr<span className="font-semibold">Money</span></h1></div></Link> : <Link to='/'><div className="flex items-center"><img src={logo} className="w-[40px] "/><h1 className="text-2xl hidden sm:inline">Purr<span className="font-semibold">Money</span></h1></div></Link>}

            {isLoggedIn ? <div className="flex gap-x-5">
                <Link to='/dashboard' className="hidden sm:inline-block">Home</Link>
                <Link to='/market'>Market</Link>
                <Link to='/transactions'>Transactions</Link>
                <Link to='/logout' onClick={handleGoogleLogout}>LogOut</Link>
            </div> : <div className="flex gap-x-5">
                <h1 onClick={() => {navigate('/authentication')}} className="cursor-pointer">Get Started</h1>
            </div>}
        </div>
    )
}