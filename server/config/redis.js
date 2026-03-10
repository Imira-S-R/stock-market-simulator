const { createClient } = require('redis')
require('dotenv').config()

const redisClient = createClient({
  url: process.env.REDIS_URI
})

module.exports = redisClient