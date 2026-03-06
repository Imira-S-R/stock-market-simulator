import { useState } from "react"
import { get_user_wishlist } from "../../api"
import { useNavigate } from "react-router-dom"

export default function UserWishlist() {
    const [userWishList, setUserWishList] = useState([])
    const navigate = useNavigate()

    useState(() => {
        const fetchData = async () => {
            const data = await get_user_wishlist()
            setUserWishList(data)
            console.log(data)
        }

        fetchData()
    }, [])


    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Wishlist</h2>
                <span className="text-sm text-gray-400">
                    {userWishList.length} items
                </span>
            </div>

            {userWishList.length === 0 && (
                <div className="text-gray-400 text-md text-center py-10">
                    Your wishlist is empty
                </div>
            )}

            <div className="grid gap-4">
                {userWishList.map((stock) => {
                    const ticker = stock.split(".")[0];
                    const exchange = stock.split(".")[1];

                    return (
                        <div
                            key={stock}
                            onClick={() =>
                                navigate("/company-profile", {
                                    state: stock,
                                })
                            }
                            className="
            flex items-center justify-between
            bg-white/5 border border-white/10
            rounded-xl px-5 py-4
            cursor-pointer
            hover:bg-white/10
            hover:border-blue-400/30
            hover:scale-[1.02]
            transition-all duration-300
            group
          "
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-semibold">
                                    {ticker[0]}
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold group-hover:text-blue-400 transition">
                                        {ticker}
                                    </h3>
                                    <p className="text-xs text-gray-400">{exchange}</p>
                                </div>
                            </div>

                            <div className="text-gray-400 group-hover:text-blue-400 transition">
                                →
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}