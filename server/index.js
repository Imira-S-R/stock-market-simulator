const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const stockRoutes = require('./routes/stockRoutes')
const snapshotRoutes = require('./routes/snapshotRoutes')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo').default
require('dotenv').config()
// const { ensureAuth } = require('./middleware/auth')


require('./config/passport')(passport)

const app = express()

dbURI = process.env.DATABASE_URL

app.use(cors({
  origin: true,       // allow all origins
  credentials: true   // allow cookies
}));
app.set('trust proxy', 1);
// secure: false, sameSite: 'none', maxAge: 1000 * 60 * 60 * 24 ADD THIS WHEN DEPLOYING
app.use(express.json())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, sameSite: 'none', maxAge: 1000 * 60 * 60 * 24 },
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL
  }),
}))
app.use(passport.initialize())
app.use(passport.session())
app.get('/api', (req, res) => res.send('hello'))
app.get('/api/check_user', (req, res,) => {
  if (req.isAuthenticated()) {
    res.status(201).send('goood')
  } else {
    res.status(500).send('nope')
  }
})
app.use(authRoutes)
app.use(stockRoutes)
app.use(snapshotRoutes)

mongoose.connect(dbURI).catch((err) => console.log(err));

if (process.env.NODE_ENV !== 'production') {

  // // Serve static files from the dist directory
  // app.use(express.static("dist"));
  // // Serve index.html for all other requests
  // app.get("/{*splat}", (req, res) => {
  //   res.sendFile(__dirname + "/dist/index.html");
  // });
  // // Start the server
  const port = process.env.PORT || 4444;
  mongoose.connect(dbURI).then((result) => app.listen(3000)).catch((err) => { console.log(err) })
}

module.exports = app