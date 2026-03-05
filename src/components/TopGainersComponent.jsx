import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from 'react-spinners'

export default function TopGainers() {
    const [data, setData] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/get_gainers`, { credentials: 'include' })
            const data = await res.json()
            setData(data)
        }

        fetchData()
    }, [])

    const navigate = useNavigate();

    if (!data) return <div className="text-center"><ClipLoader color="#ffff"/></div>;
    if (data.length === 0) return <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl text-center">No Top Gainers Yet</div>;

    return (
        <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-wide">
                    Top Gainers
                </h2>
                <span className="text-gray-400 text-sm">
                    Today's best performing stocks
                </span>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {data.map((company) => {
                        const isPositive = company.changePercentage >= 0;

                        return (
                            <div
                                key={company.symbol}
                                onClick={() => {
                                    console.log(company.symbol)
                                    navigate("/company-profile", {
                                        state: company.symbol,
                                    })
                                }
                                }
                                className="bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer 
                                           hover:bg-white/10 hover:scale-105 
                                           transition-all duration-300 group"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold group-hover:text-blue-400 transition">
                                        {company.symbol.split(".")[0]}
                                    </h3>

                                    <span
                                        className={`text-sm font-semibold px-2 py-1 rounded-full
                                        ${isPositive
                                                ? "bg-green-500/20 text-green-400 border border-green-500"
                                                : "bg-red-500/20 text-red-400 border border-red-500"
                                            }`}
                                    >
                                        {isPositive ? "+" : ""}
                                        {company.changePercentage.toFixed(1)}%
                                    </span>
                                </div>

                                <p className="mt-4 text-2xl font-semibold">
                                    LKR {company.price}
                                </p>

                                <p className="text-gray-500 text-sm mt-1">
                                    Current Price
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}