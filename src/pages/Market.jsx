import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopGainers from "../components/TopGainersComponent";
import { get_company_info } from "../../api";
import { ClipLoader } from 'react-spinners'

export default function Market() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchTerm.trim() !== "") {
                fetchData();
            } else {
                setSearchData([]);
            }
        }, 600);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/search_stock`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ searchTerm }),
                }
            );

            if (!res.ok) throw new Error("Search failed");

            const result = await res.json();
            setSearchData(result.slice(0, 20));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-[100px] px-4 pb-6">
            <div className="max-w-[1100px] mx-auto">

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-wide">
                        Search Companies & Markets
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Discover stocks by name or symbol
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="relative w-full max-w-[500px]">
                        <input
                            type="text"
                            placeholder="Enter company name or symbol..."
                            value={searchTerm}
                            onChange={(e) => {setSearchTerm(e.target.value); setLoading(true)}}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md transition"
                        />
                        {loading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                Searching...
                            </div>
                        )}
                    </div>
                </div>

                {searchTerm && (
                    <div className="mt-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-gray-400 text-lg mb-6">
                            Search Results
                        </h2>

                        {loading ? (
                            <div className="text-center"><ClipLoader color="#fffff"/></div>
                        ) : searchData.length === 0 ? (
                            <p className="text-gray-500 text-center py-10">
                                No results found
                            </p>
                        ) : (
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {searchData.map((company) => (
                                    <div
                                        key={company.symbol}
                                        onClick={async () => {
                                            const data =
                                                await get_company_info(
                                                    company.symbol
                                                );
                                            navigate("/company-profile", {
                                                state: company.symbol,
                                            })
                                        }}
                                        className="bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer hover:bg-white/10 hover:scale-105 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-bold">
                                                {company.symbol.split(".")[0]}
                                            </h3>
                                        </div>

                                        <p className="text-gray-400 mt-2 text-sm line-clamp-2">
                                            {company.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-16">
                    <TopGainers />
                </div>
            </div>
        </div>
    );
}