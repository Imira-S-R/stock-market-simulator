const { Router } = require('express')
const authController = require('../controllers/authController')
const passport = require('passport')
require('dotenv').config()

const router = Router()

router.post('/api/signup', authController.signup_post)

router.get('/api/google', passport.authenticate('google', { scope: ['profile'] }))

// router.get('/api/google/callback', (req, res, next) => {
//     passport.authenticate('google', (err, user, info) => {
//         if (err) return next(err);
//         if (!user) return res.redirect('/'); // failure

//         // Log user in
//         req.logIn(user, (err) => {
//             if (err) return next(err);
//             return res.redirect(process.env.FRONTEND_URL); // success
//         });
//     })(req, res, next);
// });

router.get('/api/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => { res.redirect(`${process.env.FRONTEND_URL}`) })

router.get('/api/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.status(200).json({ success: true })
    })
})

router.get('/api/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not logged in' })
    }

    // req.user contains the authenticated user object
    console.log('Authenticated user ID:', req.user.id)
    res.json({ id: req.user.id, email: req.user.email })
})

module.exports = router