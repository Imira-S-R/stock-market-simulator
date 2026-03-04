import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from 'react-spinners'

export default function TopGainers() {
    const [data, setData] = useState()

    // const data = [
    //     {
    //         "id": 54730972,
    //         "securityId": 1786,
    //         "symbol": "HVA.N0000",
    //         "price": 4.9,
    //         "change": 0.8,
    //         "changePercentage": 19.51219512195122,
    //         "tradeDate": 1772182815000
    //     },
    //     {
    //         "id": 54731035,
    //         "securityId": 1849,
    //         "symbol": "SHL.N0000",
    //         "price": 8.8,
    //         "change": 1.4,
    //         "changePercentage": 18.91891891891892,
    //         "tradeDate": 1772183162000
    //     },
    //     {
    //         "id": 54731082,
    //         "securityId": 1041,
    //         "symbol": "CRL.N0000",
    //         "price": 7.0,
    //         "change": 0.7,
    //         "changePercentage": 11.11111111111111,
    //         "tradeDate": 1772183057000
    //     },
    //     {
    //         "id": 54731019,
    //         "securityId": 1789,
    //         "symbol": "SFCL.N0000",
    //         "price": 878.0,
    //         "change": 86.5,
    //         "changePercentage": 10.92861655085281,
    //         "tradeDate": 1772183704000
    //     },
    //     {
    //         "id": 54730364,
    //         "securityId": 1596,
    //         "symbol": "ODEL.N0000",
    //         "price": 14.6,
    //         "change": 1.4,
    //         "changePercentage": 10.606060606060606,
    //         "tradeDate": 1772183124000
    //     },
    //     {
    //         "id": 54731002,
    //         "securityId": 5127,
    //         "symbol": "JAT.N0000",
    //         "price": 46.5,
    //         "change": 3.5,
    //         "changePercentage": 8.13953488372093,
    //         "tradeDate": 1772182818000
    //     },
    //     {
    //         "id": 54731014,
    //         "securityId": 5311,
    //         "symbol": "HBS.N0000",
    //         "price": 23.9,
    //         "change": 1.6,
    //         "changePercentage": 7.174887892376682,
    //         "tradeDate": 1772183212000
    //     },
    //     {
    //         "id": 54731015,
    //         "securityId": 189,
    //         "symbol": "BOGA.N0000",
    //         "price": 153.0,
    //         "change": 10.0,
    //         "changePercentage": 6.993006993006993,
    //         "tradeDate": 1772183342000
    //     },
    //     {
    //         "id": 54731020,
    //         "securityId": 378,
    //         "symbol": "CLND.N0000",
    //         "price": 62.9,
    //         "change": 3.7,
    //         "changePercentage": 6.25,
    //         "tradeDate": 1772183087000
    //     },
    //     {
    //         "id": 54729319,
    //         "securityId": 259,
    //         "symbol": "CERA.N0000",
    //         "price": 184.75,
    //         "change": 10.5,
    //         "changePercentage": 6.025824964131994,
    //         "tradeDate": 1772182738000
    //     }
    // ]

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