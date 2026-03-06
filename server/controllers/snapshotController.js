const Snapshot = require('../models/Snapshot')
const User = require('../models/User')

module.exports.get_portfolio_chart_values = async (req, res) => {
    const labels = [];
    let values = [];
    const userId = req.user._id;

    const today = new Date();

    const startDate = new Date();
    startDate.setDate(today.getDate() - 5);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(today.getDate() - 1);
    endDate.setHours(23, 59, 59, 999);

    const transactions = await Snapshot.find({
        userId: userId,
        createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    const transactionMap = {};

    transactions.forEach(transaction => {
        const dateKey = transaction.createdAt.toISOString().split('T')[0];
        transactionMap[dateKey] = transaction.portfolioValue;
    });

    for (let i = 5; i >= 1; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);

        const dateKey = d.toISOString().split('T')[0];

        labels.push(d.getDate());
        values.push(transactionMap[dateKey] || 1000000);
    }

    console.log(labels, values);

    res.json({
        labels,
        values
    });
}

module.exports.add_portfolio_chart_values = async (req, res) => {
    
    const users = await User.find({})
    for (const user of users) {
        let portfolio_value = 0;

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

        console.log(user._id, portfolio_value);
        const chart_value = await Snapshot.create({
            userId: user._id,
            portfolioValue: portfolio_value + user.cashBalance
        })
    }
    res.send('done')
}