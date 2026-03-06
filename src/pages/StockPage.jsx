import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { get_company_info, get_company_chart_info, get_user_wishlist, add_to_wishlist, remove_from_wishlist } from "../../api";
import { ClipLoader } from 'react-spinners'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import { isWhitelisted } from "validator";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

export default function StockPage() {
    const { state } = useLocation() || {};
    const [data, setData] = useState();
    const [buyOpen, setBuyOpen] = useState(false)
    const [sellOpen, setSellOpen] = useState(false)
    const [stockPrice, setStockPrice] = useState(0)
    const [quantity, setQuantity] = useState(1);
    const [stockSymbol, setStockSymbol] = useState("");
    const [userHoldings, setUserHoldings] = useState()
    const [user, setUser] = useState()
    const [maxStocks, setMaxStocks] = useState(0)
    const [chartLabel, setChartLabel] = useState([])
    const [chartData, setChartData] = useState([])
    const [isWishlisted, setIsWishlisted] = useState(false)

    const _data = {
        labels: chartLabel,
        datasets: [
            {
                label: "Portfolio Value",
                data: chartData,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.15)",
                fill: true,
                tension: 0.4,
                pointRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(255,255,255,0.1)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(255,255,255,0.2)",
                borderWidth: 1,
                displayColors: false,
                padding: 8,
                cornerRadius: 6,
                callbacks: {
                    title: () => "",
                    label: (context) => context.formattedValue,
                },
            },
        },
        interaction: {
            mode: "nearest",
            intersect: true,
        },
        scales: {
            x: {
                ticks: { color: "#9ca3af" },
                grid: { color: "rgba(255,255,255,0.05)" },
            },
            y: {
                ticks: { color: "#9ca3af" },
                grid: { color: "rgba(255,255,255,0.05)" },
            },
        },
    };

    async function handleBuySell(symbol, qty, type) {
        if (type === 'buy') {
            console.log(symbol, qty, type)
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/buy_stock`, {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        symbol: symbol,
                        price_bought: stockPrice,
                        shares: qty
                    },)
                });

                const data = await res.json();
                console.log("Server response:", data);

                if (res.ok) {
                    console.log('HOORAY')
                }

            } catch (err) {
                console.log(err)
            }
            console.log(`Buying ${qty} shares of ${symbol}`);
        } else {
            if (quantity > maxStocks) {
                console.log('You aint got enough stocks gng')
                return
            }
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/sell_stock`, {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        symbol: symbol,
                        price_sold: stockPrice,
                        shares: qty
                    })
                });

                const data = await res.json();
                console.log("Server response:", data);

                if (res.ok) {
                    console.log('HOORAY')
                }

            } catch (err) {
                console.log(err)
            }
            console.log(`Selling ${qty} shares of ${symbol}`);
        }
    }

    async function handleWishlisting(isWishlisted) {
        if (isWishlisted) {
            add_to_wishlist(state)
        } else {
            remove_from_wishlist(state)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await get_company_info(state);
            const chart_res = await get_company_chart_info(res.reqSymbolInfo.id)
            const user_wishlist = await get_user_wishlist()
            if (user_wishlist.includes(state)) {
                setIsWishlisted(true)
            }
            setChartLabel(chart_res[0])
            setChartData(chart_res[1])
            setStockSymbol(res.reqSymbolInfo.symbol)
            setStockPrice(res.reqSymbolInfo.lastTradedPrice)
            setData(res);
        };

        const fetchUserHoldings = async () => {
            let user_holdings = []

            const res = await fetch(`${import.meta.env.VITE_API_URL}/get_user_info`, { credentials: 'include' })
            const data = await res.json()

            setUser(data)
            console.log(data)

            for (const stock of data.portfolio) {
                if (stock.shares !== 0) {
                    user_holdings.push(stock.symbol)
                    if (stock.symbol === state) {
                        setMaxStocks(stock.shares)
                        console.log(stock.shares)
                    }
                }
            }


            setUserHoldings(user_holdings)
        }

        fetchUserHoldings()
        fetchData();
    }, []);

    if (!data) return <div className="text-center pt-[80px] min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black"><ClipLoader color="#ffff" /></div>;

    const change = Number(data.reqSymbolInfo.changePercentage);
    const isPositive = change >= 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-[90px] px-4 pb-7">
            <div className="max-w-[1100px] mx-auto">

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/10">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

                        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                            <div className="w-[220px] h-[150px] bg-white rounded-xl flex justify-center items-center shadow-lg">
                                {data.reqLogo && (
                                    <img
                                        src={`https://cdn.cse.lk/cmt/${data.reqLogo.path}`}
                                        className="w-full h-full object-contain p-4"
                                        alt="Company Logo"
                                    />
                                )}
                            </div>

                            <div>
                                <div className="flex items-center gap-x-2 flex-col sm:flex-row">
                                    <h1 className="text-3xl font-bold tracking-wide">
                                        {data.reqSymbolInfo.name}
                                    </h1>
                                    <div className="text-3xl bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-lg my-2 sm:my-0" onClick={() => {setIsWishlisted(prev => !prev);  handleWishlisting(!isWishlisted)}}>{isWishlisted ? <FaStar /> : <CiStar />}</div>
                                </div>
                                <p className="text-lg text-gray-400 mt-1">
                                    SYMBOL: {data.reqSymbolInfo.symbol}
                                </p>

                                <div
                                    className={`mt-4 inline-block px-4 py-2 rounded-full font-semibold text-lg 
                                    ${isPositive
                                            ? "bg-green-500/20 text-green-400 border border-green-500"
                                            : "bg-red-500/20 text-red-400 border border-red-500"
                                        }`}
                                >
                                    {isPositive ? "+" : ""}
                                    {change.toFixed(2)}%
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button onClick={() => { setBuyOpen(true) }} className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg hover:scale-105 font-semibold">
                                BUY
                            </button>
                            <button onClick={() => { setSellOpen(true) }} className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg hover:scale-105 font-semibold">
                                SELL
                            </button>
                        </div>

                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

                    <StatCard
                        title="Last Traded Price"
                        value={`${data.reqSymbolInfo.lastTradedPrice} LKR`}
                    />
                    <StatCard
                        title="Previous Close"
                        value={`${data.reqSymbolInfo.previousClose} LKR`}
                    />
                    <StatCard
                        title="Highest Price"
                        value={`${data.reqSymbolInfo.ytdHiPrice} LKR`}
                    />
                    <StatCard
                        title="Lowest Price"
                        value={`${data.reqSymbolInfo.ytdLowPrice} LKR`}
                    />

                </div>

                <div className="mt-10 p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
                    <h2 className="text-white/90 font-semibold text-lg mb-4 text-center">
                        Last Month Prices
                    </h2>

                    <div className="h-[300px]"><Line data={_data} options={options} /></div>
                </div>
            </div>

            {buyOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    aria-modal="true"
                    role="dialog"
                    tabIndex={-1}
                >
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        onClick={() => setBuyOpen(false)}
                        aria-hidden="true"
                    />

                    <div className="relative w-[90%] max-w-[400px] p-7 rounded-2xl 
            bg-white/20 backdrop-blur-xl 
            border border-white/30 
            shadow-[0_8px_40px_rgba(0,0,0,0.3)] 
            text-white z-10">

                        <h2 className="text-2xl font-semibold mb-5 tracking-wide">
                            Buy Stock
                        </h2>

                        <label htmlFor="stock-symbol" className="block mb-2 text-sm font-medium text-white/80">
                            Stock Symbol
                        </label>

                        <input
                            id="stock-symbol"
                            type="text"
                            value={stockSymbol}
                            readOnly
                            className="w-full mb-4 px-3 py-2 rounded-lg
                bg-white/10 border border-white/20
                text-white placeholder-white/60
                backdrop-blur-sm cursor-not-allowed"
                        />

                        <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-white/80">
                            Quantity
                        </label>

                        <input
                            id="quantity"
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full mb-4 px-3 py-2 rounded-lg
                bg-white/10 border border-white/20
                text-white placeholder-white/60
                focus:outline-none focus:ring-2 focus:ring-green-400"
                        />

                        <p className="mb-3 text-red-300 font-medium">
                            Price: -{quantity * stockPrice} LKR
                        </p>

                        {(quantity * stockPrice > user.cashBalance) && (
                            <p className="mb-4 text-red-300 font-medium">
                                You do not have enough cash
                            </p>
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setBuyOpen(false)}
                                className="px-4 py-2 rounded-lg 
                    bg-white/10 border border-white/20 
                    hover:bg-white/20 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    if (!(quantity * stockPrice > user.cashBalance)) {
                                        handleBuySell(stockSymbol, quantity, 'buy');
                                        setBuyOpen(false);
                                    }
                                }}
                                className="px-4 py-2 rounded-lg 
                    bg-green-500/80 hover:bg-green-500 
                    shadow-lg transition"
                                disabled={quantity < 1}
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {sellOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    aria-modal="true"
                    role="dialog"
                    tabIndex={-1}
                >
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        onClick={() => setSellOpen(false)}
                        aria-hidden="true"
                    />

                    <div className="relative w-[90%] max-w-[400px] p-7 rounded-2xl 
            bg-white/20 backdrop-blur-xl 
            border border-white/30 
            shadow-[0_8px_40px_rgba(0,0,0,0.3)] 
            text-white z-10">

                        <h2 className="text-2xl font-semibold mb-5 tracking-wide">
                            Sell Stock
                        </h2>

                        <label htmlFor="stock-symbol" className="block mb-2 text-sm font-medium text-white/80">
                            Stock Symbol
                        </label>

                        <input
                            id="stock-symbol"
                            type="text"
                            value={stockSymbol}
                            readOnly
                            className="w-full mb-4 px-3 py-2 rounded-lg
                bg-white/10 border border-white/20
                text-white placeholder-white/60
                backdrop-blur-sm cursor-not-allowed"
                        />

                        <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-white/80">
                            Quantity
                        </label>

                        <input
                            id="quantity"
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full mb-4 px-3 py-2 rounded-lg
                bg-white/10 border border-white/20
                text-white placeholder-white/60
                focus:outline-none focus:ring-2 focus:ring-red-400"
                        />

                        {userHoldings.includes(stockSymbol) ? (
                            <p className="mb-3 text-green-300 font-medium">
                                Price: +{quantity * stockPrice} LKR
                            </p>
                        ) : (
                            <p className="mb-3 text-red-300 font-medium">
                                You don't own this stock
                            </p>
                        )}

                        {(quantity > maxStocks) && (
                            <p className="mb-3 text-red-300 font-medium">
                                Not enough stocks
                            </p>
                        )}



                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setSellOpen(false)}
                                className="px-4 py-2 rounded-lg 
                    bg-white/10 border border-white/20 
                    hover:bg-white/20 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    if (quantity > maxStocks) {
                                        return
                                    }

                                    if (userHoldings.includes(stockSymbol)) {
                                        handleBuySell(stockSymbol, quantity, 'sell');
                                        setSellOpen(false);
                                    } else {
                                        console.log('You dont own this stock gng');
                                    }
                                }}
                                className="px-4 py-2 rounded-lg 
                    bg-red-500/80 hover:bg-red-500 
                    shadow-lg transition"
                                disabled={quantity < 1}
                            >
                                Sell
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-3xl font-bold">{value}</h2>
            <p className="text-gray-400 mt-2">{title}</p>
        </div>
    );
}