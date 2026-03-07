const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')
require('dotenv').config()

module.exports = function (passport) {

  passport.use(new LocalStrategy(
    { usernameField: "email" },
    async function (email, password, cb) {
      try {
        const user = await User.findOne({ email })
        if (!user) return cb(null, false, { message: "Incorrect email or password" })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return cb(null, false, { message: "Incorrect email or password" })
        return cb(null, user)
      } catch (err) {
        return cb(err)
      }
    }
  ))

  passport.use(new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.WEBSITE_URL}/api/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id })
        if (user) return done(null, user)

        user = await User.create({
          googleId: profile.id,
          portfolio: [],
          cashBalance: 1000000
        })
        done(null, user)
      } catch (err) {
        done(err) 
      }
    }
  ))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
}