import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const navigate = useNavigate()

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/google`
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/check_user`, {
                    method: "GET", 
                    credentials: "include"
                })

                console.log("Response status:", res.status)
                console.log("Response headers:", [...res.headers.entries()])

                const data = await res.json().catch(() => null)
                console.log("Response body:", data)

                if (res.ok) {
                    navigate("/dashboard")
                }
            } catch (err) {
                console.error("Fetch error:", err)
            }
        }

        checkAuth()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center px-4">
            <div className="max-w-[1100px] mx-auto text-center">

                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    The Smart Way to Learn Investing
                </h1>

                <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                    Simulate real stock market investing, test strategies, and sharpen your
                    skills before risking real money.
                </p>

                <button onClick={() => {navigate('/authentication')}} className="mt-10 px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-green-500/30">
                    Get Started
                </button>

            </div>
        </div>
    )
}