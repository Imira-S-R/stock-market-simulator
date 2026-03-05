import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserHoldings() {
    const [userHoldings, setUserHoldings] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user_holdings`, { credentials: 'include' })
            const data = await res.json()
            console.log(data)
            setUserHoldings(data)
        }
        fetchData()
    }, [])


    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">

            <h2 className="text-lg sm:text-xl font-semibold mb-6">
                Your Holdings
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-[600px] w-full text-sm">
                    <thead className="text-gray-400 border-b border-white/10">
                        <tr>
                            <th className="text-left py-4">Name</th>
                            <th className="text-right py-4">Shares</th>
                            <th className="text-right py-4">Current Price</th>
                            <th className="text-right py-4">Price Bought</th>
                        </tr>
                    </thead>

                    {/* <tbody>
                        <tr>
                            <td colSpan="4" className="py-16 text-center text-gray-500">
                                No stocks owned yet
                            </td>
                        </tr>
                    </tbody> */}
                    <tbody>
                        {userHoldings?.length > 0 ? (
                            userHoldings.map((holding, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                                    onClick={() => {
                                        navigate("/company-profile", {
                                            state: holding.symbol,
                                        })
                                    }}
                                >
                                    <td className="py-4 text-left flex items-center gap-3">
                                        {holding.symbol.split('.')[0]}

                                        {(() => {
                                            const gainLoss =
                                                (holding.current_price - holding.price_bought) * holding.shares
                                            const isProfit = gainLoss >= 0

                                            return (
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-md border${isProfit
                                                            ? "bg-green-500/10 text-green-400 border-green-400/30"
                                                            : "bg-red-500/10 text-red-400 border-red-400/30"
                                                        }`}
                                                >
                                                    LKR {isProfit && "+"} {gainLoss.toFixed(2)}
                                                </span>
                                            )
                                        })()}
                                    </td>

                                    <td className="py-4 text-right">
                                        {holding.shares}
                                    </td>

                                    <td className="py-4 text-right">
                                        LKR {holding.current_price}
                                    </td>

                                    <td className="py-4 text-right">
                                        LKR {holding.price_bought}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-16 text-center text-gray-500">
                                    No stocks owned yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}