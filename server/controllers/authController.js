const User = require("../models/User")

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.create({ email, password, cashBalance: 1000000, portfolio: [] })
        res.status(201).send({user: user._id})
    } catch (err) {
        console.log(err)
    }
}

//69a425c7d53bcf95162e7be7