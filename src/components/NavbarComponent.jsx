import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function NavbarComponent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/google`
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
            {isLoggedIn ? <Link to='/dashboard'><span className="text-2xl">Logo</span></Link> : <Link to='/'><span className="text-2xl">Logo</span></Link>}

            {isLoggedIn ? <div className="flex gap-x-5">
                <Link to='/market'>Market</Link>
                <Link to='/transactions'>Transactions</Link>
                <Link to='/logout' onClick={handleGoogleLogout}>LogOut</Link>
            </div> : <div className="flex gap-x-5">
                <h1 onClick={handleGoogleLogin} className="cursor-pointer">Get Started</h1>
            </div>}
        </div>
    )
}