const { createClient } = require('redis')

const redisClient = createClient({
  url: 'redis://default:PU7SHcBQHiIpdkFOBfpMq885c1JdyQ7C@redis-18738.c257.us-east-1-3.ec2.cloud.redislabs.com:18738'
})

module.exports = redisClient