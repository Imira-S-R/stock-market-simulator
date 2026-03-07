const { Router } = require('express')
const authController = require('../controllers/authController')
const passport = require('passport')
const User = require('../models/User')
const bcrypt = require('bcrypt')
require('dotenv').config()

const router = Router()

router.post('/api/signup', authController.signup_post)

router.get('/api/google', passport.authenticate('google', { scope: ['profile'] }))

router.post('/api/login/password', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(401).json({ message: info?.message || 'Login failed' })

        req.logIn(user, (err) => {
            if (err) return next(err)
            return res.status(200).json({ message: 'Login successful', user })
        })
    })(req, res, next)
})

router.get(`/api/google/callback`, passport.authenticate('google', { failureRedirect: '/' }), (req, res) => { res.redirect(`${process.env.FRONTEND_URL}`) })

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

router.post('/api/signup/password', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            portfolio: [],
            cashBalance: 1000000,
            wishlist: []
        });

        await newUser.save();

        req.login(newUser, (err) => {
            if (err) return next(err);
            res.json({ message: 'Signed up and logged in!', user: { email: newUser.email, id: newUser.id } });
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router