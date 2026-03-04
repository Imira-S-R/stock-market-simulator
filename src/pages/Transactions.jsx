import { useEffect, useState } from "react";

export default function Transactions() {
    const [userTransactions, setUserTransactions] = useState()

    const transactions = [
        {
            id: 1,
            name: "JKH",
            shares: 20,
            type: "BUY",
            price: 450,
            status: "COMPLETED",
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user_transactions`, { credentials: 'include' })
            const data = await res.json()
            setUserTransactions(data.reverse())
        }

        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-[90px] px-4 pb-7">
            <div className="max-w-[1100px] mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-wide">
                        Transactions
                    </h1>
                    <p className="text-gray-400 mt-2">
                        View your complete trading history
                    </p>
                </div>

                {/* Table Card */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                    {!userTransactions ? (
                        <div className="py-20 text-center">
                            <h2 className="text-2xl text-gray-400">
                                No transactions yet
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Your completed trades will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="py-4 px-6 text-left">Name</th>
                                        <th className="py-4 px-6 text-center">Shares</th>
                                        <th className="py-4 px-6 text-center">Type</th>
                                        <th className="py-4 px-6 text-center">Share Price</th>
                                        <th className="py-4 px-6 text-center">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {userTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-20 text-center">
                                                <h2 className="text-2xl text-gray-400">No transactions yet</h2>
                                                <p className="text-gray-500 mt-2">
                                                    Your completed trades will appear here.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        userTransactions.map((tx) => {
                                            const isBuy = tx.type === "BUY";

                                            return (
                                                <tr
                                                    key={tx.id}
                                                    className="border-t border-white/5 hover:bg-white/5 transition duration-200"
                                                >
                                                    <td className="py-4 px-6 font-medium">{tx.symbol.split('.')[0]}</td>

                                                    <td className="py-4 px-6 text-center">{tx.quantity}</td>

                                                    <td className="py-4 px-6 text-center">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${isBuy
                                                                    ? "bg-green-500/20 text-green-400 border border-green-500"
                                                                    : "bg-red-500/20 text-red-400 border border-red-500"
                                                                }`}
                                                        >
                                                            {tx.type}
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-6 text-center text-gray-300">
                                                        LKR {tx.pricePerShare}
                                                    </td>

                                                    <td className="py-4 px-6 text-center">
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500">
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}