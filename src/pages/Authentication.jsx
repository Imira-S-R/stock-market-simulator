import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AuthenticationScreen({ setIsLoggedIn }) {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(false)
    const [errorText, setErrorText] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/google`
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLoginSignup = async () => {

        if (!isLogin) {
            if (!validateEmail(email)) {
                setErrorText('Please enter valid email')
                return
            }

            if (password.length < 6) {
                setErrorText('Please enter a password with 6 charachters')
                return
            }
        }


        if (email && password) {
            if (isLogin) {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/login/password`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                    credentials: 'include'
                })

                if (res.ok) {
                    setIsLoggedIn(true)
                    navigate('/dashboard')
                } else {
                    const error = await res.json()
                    setErrorText(error.message)
                }

                console.log(res)
            } else {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/signup/password`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                    credentials: 'include'
                })

                if (res.ok) {
                    setIsLoggedIn(true)
                    navigate('/dashboard')
                } else {
                    const error = await res.json()
                    setErrorText(error.message)
                }

                console.log(res)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">

                <h1 className="text-3xl font-semibold text-center mb-6 tracking-wide">
                    {isLogin ? 'Log In' : 'Sign Up'}
                </h1>

                <div className="space-y-4">

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-lg
        bg-white/10 border border-white/20
        text-white placeholder-white/50
        focus:outline-none focus:ring-2 focus:ring-slate-500
        transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-lg
        bg-white/10 border border-white/20
        text-white placeholder-white/50
        focus:outline-none focus:ring-2 focus:ring-slate-500
        transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="w-full py-3 rounded-lg
        bg-slate-700 hover:bg-slate-600
        transition duration-200
        font-medium tracking-wide
        shadow-lg shadow-slate-900/50"
                        onClick={() => {
                            handleLoginSignup()
                        }}
                    >
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>

                    <h1 className="text-red-500 text-center">{errorText}</h1>

                    <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-sm text-white/40">or</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                    </div>

                    <button
                        className="mt-4 w-full flex items-center justify-center gap-3 py-3 rounded-lg
        bg-white/10 border border-white/20
        hover:bg-white/20 transition"
                        onClick={handleGoogleLogin}
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="google"
                            className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">
                            Continue with Google
                        </span>
                    </button>

                </div>

                <p className="text-center text-sm text-white/50 mt-6">
                    {isLogin ? 'Create new account?' : 'Already have an account?'}
                    <span
                        className="text-slate-400 hover:text-slate-300 cursor-pointer ml-1"
                        onClick={() => setIsLogin(prev => !prev)}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </span>
                </p>

            </div>
        </div>
    )
}