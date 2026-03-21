import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import promo_img from '/promo-stock-market-sim.png'

export default function LandingPage({ setIsLoggedIn }) {
    const navigate = useNavigate()

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/google`
    }

    const checkAuth = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/check_user`, { credentials: 'include' })

        if (res.ok) {
            setIsLoggedIn(true)
            navigate('/dashboard')
        } else {
            navigate('/authentication')
        }

        return res.ok
    }

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const res = await fetch(`${import.meta.env.VITE_API_URL}/check_user`, {
    //                 method: "GET", 
    //                 credentials: "include"
    //             })

    //             console.log("Response status:", res.status)
    //             console.log("Response headers:", [...res.headers.entries()])

    //             const data = await res.json().catch(() => null)
    //             console.log("Response body:", data)

    //             if (res.ok) {
    //                 navigate("/dashboard")
    //             }
    //         } catch (err) {
    //             console.error("Fetch error:", err)
    //         }
    //     }

    //     checkAuth()
    // }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center px-4 sm:px-6 pt-20">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full bg-green-500/[0.08] blur-3xl pointer-events-none" />

            <section className="relative flex flex-col items-center justify-center w-full max-w-6xl mx-auto text-center pt-16 sm:pt-20 pb-10">

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight max-w-xl sm:max-w-2xl">
                    The Smart Way to{" "}
                    <span className="text-green-400">Learn Investing</span>
                </h1>

                <p className="mt-4 sm:mt-6 text-gray-400 text-sm sm:text-lg max-w-sm sm:max-w-md leading-relaxed">
                    Simulate real stock market investing and sharpen your skills before risking real money.
                </p>

                <button
                    onClick={() => checkAuth()}
                    className="mt-6 sm:mt-8 px-7 sm:px-8 py-3 sm:py-3.5 bg-green-500 hover:bg-green-400 active:scale-95 text-black font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 text-sm sm:text-base"
                >
                    Get Started
                </button>

                <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-5 sm:gap-10 text-gray-500">

                    <div className="flex flex-col items-center">
                        <span className="text-white font-semibold text-base sm:text-lg">LKR 1M</span>
                        <span className="text-xs sm:text-sm">virtual cash</span>
                    </div>

                    <div className="hidden sm:block w-px h-8 bg-white/10" />

                    <div className="flex flex-col items-center">
                        <span className="text-white font-semibold text-base sm:text-lg">300+</span>
                        <span className="text-xs sm:text-sm">CSE stocks</span>
                    </div>

                    <div className="hidden sm:block w-px h-8 bg-white/10" />

                    <div className="flex flex-col items-center">
                        <span className="text-white font-semibold text-base sm:text-lg">Zero</span>
                        <span className="text-xs sm:text-sm">real money needed</span>
                    </div>

                </div>

                <div className="mt-10 sm:mt-16 w-full max-w-3xl relative">

                    <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 bg-gradient-to-t from-[#0d1117] to-transparent z-10" />

                    <img
                        src={promo_img}
                        alt="PurrMoney dashboard preview"
                        className="w-full rounded-xl border border-white/[0.06] shadow-2xl shadow-black/70"
                    />
                </div>

            </section>
        </div>
    )
}