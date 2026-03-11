const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const stockRoutes = require('./routes/stockRoutes')
const snapshotRoutes = require('./routes/snapshotRoutes')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo').default
const redisClient = require('./config/redis')
require('dotenv').config()
require('./config/passport')(passport)

const app = express()

redisClient.on('error', (err) => console.error('Redis Error:', err))
redisClient.on('ready', () => console.log('Redis client ready UwU'))

;(async () => {
  try {
    await redisClient.connect()
    const pong = await redisClient.ping()
    console.log('Ping response:', pong)
  } catch (err) {
    console.error('Failed to connect to Redis:', err)
  }
})()


dbURI = process.env.DATABASE_URL

app.use(cors({
  origin: true,
  credentials: true
}));
app.set('trust proxy', 1);
app.use(express.json())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'none', maxAge: 1000 * 60 * 60 * 24},
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL
  }),
}))
app.use(passport.initialize())
app.use(passport.session())
app.get('/api/', (req, res) => res.send('hello'))
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
  const port = process.env.PORT || 4444;
  mongoose.connect(dbURI).then((result) => app.listen(3000)).catch((err) => { console.log(err) })
}

module.exports = app