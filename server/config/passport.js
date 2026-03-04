const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
require('dotenv').config();

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `/api/google/callback`
    },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                portfolio: [],
                cashBalance: 1000000
            }

            try {
                let user = await User.findOne({ googleId: profile.id })

                if (user) {
                    done(null, user)
                } else {
                    user = await User.create(newUser)
                    done(null, user)
                }
            } catch (err) {
                console.log(err)
            }
        }
    ))

    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        done(null, await User.findById(id))
    })
}



