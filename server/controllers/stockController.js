const User = require("../models/User")
const Transaction = require('../models/Transaction')
const companyData = require('../data')
const all_company_data = require("../data")

module.exports.buy_stock = async (req, res) => {
    try {
        const { symbol, shares, price_bought } = req.body
        const userId = req.user._id

        const totalCost = Number(shares) * Number(price_bought)

        const transaction = await Transaction.create({
            userId: userId,
            symbol: symbol,
            type: "BUY",
            quantity: shares,
            pricePerShare: price_bought,
            status: "COMPLETED"
        })

        const result = await User.updateOne(
            { _id: userId, "portfolio.symbol": symbol },
            {
                $inc: {
                    "portfolio.$.shares": Number(shares),
                    "cashBalance": -totalCost
                },
                $set: {
                    "portfolio.$.price_bought": Number(price_bought)
                }
            }
        )

        if (result.modifiedCount === 0) {
            await User.updateOne(
                { _id: userId },
                {
                    $push: {
                        portfolio: {
                            symbol,
                            shares: Number(shares),
                            price_bought: Number(price_bought)
                        }
                    },
                    $inc: { cashBalance: -totalCost }
                }
            )
        }

        const updatedUser = await User.findById(userId)
        res.status(200).json(updatedUser)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.sell_stock = async (req, res) => {
    const userId = req.user._id


    try {
        const { symbol, shares, price_sold } = req.body

        const transaction = await Transaction.create({
            userId: userId,
            symbol: symbol,
            type: "SELL",
            quantity: shares,
            pricePerShare: price_sold,
            status: "COMPLETED"
        })

        const result = await User.updateOne(
            { _id: userId, "portfolio.symbol": symbol },
            {
                $inc: { "portfolio.$.shares": -(Number(shares)), "cashBalance": (Number(price_sold) * Number(shares)) },
            }
        )

        const updatedUser = await User.findById(userId)

        res.status(200).json(updatedUser)


    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.get_portfolio_value = async (req, res) => {
    const userId = req.user._id
    let portfolio_value = 0
    let cash_balance = 0

    try {
        const user = await User.findById(userId)

        for (const stock of user.portfolio) {
            const response = await fetch(
                `https://www.cse.lk/api/companyInfoSummery?symbol=${stock.symbol}`,
                {
                    method: "POST",
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        Accept: "application/json",
                    },
                }
            );

            const data = await response.json();

            portfolio_value +=
                stock.shares * data.reqSymbolInfo.lastTradedPrice;
        }

        // user.portfolio.map((stock) => portfolio_value += (stock.shares * stock.price_bought))
        cash_balance = user.cashBalance

        res.status(200).json({ portfolio_value, cash_balance })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

module.exports.get_gainers = async (req, res) => {
    console.log('User ID:', req.user._id)
    try {
        const response = await fetch('https://www.cse.lk/api/topGainers',
            {
                method: "POST",
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    Accept: "application/json",
                },
            }
        )
        const result = await response.json()

        res.json(result)
    } catch (err) {
        console.log(err)
    }
}

module.exports.get_user_info = async (req, res) => {
    const userId = req.user._id

    try {
        const user = await User.findById(userId)
        res.json(user)
    } catch (err) {
        console.log(err)
    }
}

module.exports.get_user_holdings = async (req, res) => {
    const userId = req.user._id
    let user_holdings = []

    try {
        const user = await User.findById(userId)

        for (const stock of user.portfolio) {
            if (stock.shares === 0) continue;

            const response = await fetch(
                `https://www.cse.lk/api/companyInfoSummery?symbol=${stock.symbol}`,
                {
                    method: "POST",
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        Accept: "application/json",
                    },
                }
            );

            const data = await response.json();

            user_holdings.push({
                symbol: stock.symbol,
                shares: stock.shares,
                price_bought: stock.price_bought,
                current_price: data.reqSymbolInfo.lastTradedPrice,
            });
        }


        return res.json(user_holdings)

    } catch (err) {
        console.log(err)
    }
}

module.exports.search_for_company = async (req, res) => {
    const { searchTerm } = req.body

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const similarNames = all_company_data
        .filter(company => {
            const name = company.name?.toLowerCase() || "";
            const symbol = company.symbol?.toLowerCase() || "";
            return name.includes(normalizedSearch) || symbol.includes(normalizedSearch);
        })
        .sort((a, b) => {
            const aStarts = a.name.toLowerCase().startsWith(normalizedSearch);
            const bStarts = b.name.toLowerCase().startsWith(normalizedSearch);

            return bStarts - aStarts;
        });
    
    res.json(similarNames)

}

module.exports.get_company_chart_info = async (req, res) => {
    const { companyId } = req.body

    const response = await fetch(
        `https://www.cse.lk/api/companyChartDataByStock?stockId=${companyId}&period=3`,
        {
            method: "POST",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
            },
        }
    );

    const data = await response.json();

    res.json(data)
}

module.exports.get_info_company = async (req, res) => {
    const { symbol } = req.body


    try {
        const response = await fetch(
            `https://www.cse.lk/api/companyInfoSummery?symbol=${symbol}`,
            {
                method: "POST",
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "application/json",
                },
            }
        );

        const data = await response.json();

        res.json(data)

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch company data" });
    }
}

module.exports.get_user_transactions = async (req, res) => {
    const userId = req.user._id

    try {
        const transactions = await Transaction.find({ userId: userId })
        res.json(transactions)
    } catch (err) {
        res.json(err)
    }


}