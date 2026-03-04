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
import { useState } from "react";
import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { ClipLoader } from 'react-spinners'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

export default function PortfolioSummary() {
    const [chartData, setChartData] = useState([])
    const [chartLables, setChartLabels] = useState([])


    const data = {
        labels: chartLables,
        datasets: [
            {
                label: "Portfolio Value",
                data: chartData,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.15)",
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
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

    const [userData, setUserData] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/get_value`, { credentials: 'include' })
            const data = await res.json()
            console.log(data)
            setUserData(data)

            const res_chart = await fetch(`${import.meta.env.VITE_API_URL}/get_snapshot_values`, { credentials: 'include' })
            const data_chart = await res_chart.json()
            setChartLabels(data_chart.labels)
            setChartData(data_chart.values)
        }

        fetchData()
    }, [])

    return (
        userData ? <div className="grid lg:grid-cols-3 gap-6">

            {/* Left Stat Cards */}
            <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
                    <p className="text-gray-400 text-sm">Portfolio Value</p>
                    <h1 className="text-3xl font-bold mt-2">
                        LKR {userData.portfolio_value}
                    </h1>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
                    <p className="text-gray-400 text-sm">Cash Available</p>
                    <h1 className="text-3xl font-bold mt-2">
                        LKR {userData.cash_balance}
                    </h1>
                </div>
            </div>

            {/* Chart Card */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col">
                <h2 className="text-gray-400 text-sm mb-4">
                    Portfolio Performance
                </h2>

                <div className="h-[220px]">
                    <Line data={data} options={options} />
                </div>
            </div>
        </div> : <div className="text-center"><ClipLoader color="#fffff"/></div>
    );
}