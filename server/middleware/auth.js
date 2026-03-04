module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            
        } else {
            res.status(400).send('nope')
        }
    },
}