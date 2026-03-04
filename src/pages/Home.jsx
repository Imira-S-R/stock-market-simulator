import { useEffect, useState } from "react"
import PortfolioSummary from "../components/PortfolioSummaryComponent"
import TopGainers from "../components/TopGainersComponent"
import UserHoldings from "../components/UserHoldingsComponent"
import { useNavigate } from "react-router-dom";

export default function Home() {
    let user_id;
    const navigate = useNavigate()
    const [isPreMarket, setIsPreMarket] = useState(false)

    function isPreMarketIST() {
        const now = new Date();

        const istTime = new Date(
            now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );
        console.log(istTime)

        const hours = istTime.getHours();
        const minutes = istTime.getMinutes();

        const totalMinutes = hours * 60 + minutes;

        const start = 7 * 60 + 30;  // 7:30 AM
        const end = 9 * 60 + 30;    // 9:30 AM

        return totalMinutes >= start && totalMinutes < end;
    }

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, { credentials: 'include' })

            if (res.ok) {
                const data = await res.json()
                user_id = data.id
                console.log(user_id)
            } else {
                navigate('/')
            }

            if (isPreMarketIST()) {
                setIsPreMarket(true)
            }
        }

        checkAuth()
    }, [])


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-24 px-4">
            <div className="max-w-7xl mx-auto space-y-8 max-w-[1100px] pb-7">

                {isPreMarket && <div className="bg-red-500/5 backdrop-blur-lg border border-red-400/20 rounded-2xl p-6 shadow-xl shadow-red-900/10 text-center">
                    <p className="text-red-300 font-semibold tracking-wide uppercase text-sm mb-2">
                        Market Notice
                    </p>
                    <p className="text-white/80 text-sm">
                        During the pre-open period and shortly after market open, live prices may be temporarily unavailable.
                        Data will update automatically once trading information is published.
                    </p>
                </div>}

                <PortfolioSummary />
                <UserHoldings />
            </div>
        </div>
    );
}