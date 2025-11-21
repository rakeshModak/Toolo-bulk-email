const IORedis = require("ioredis");

const redisClient = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

// Connection event handlers
redisClient.on('connect', () => {
  console.log('✅ Redis: Connected successfully');
});

redisClient.on('ready', () => {
  console.log('✅ Redis: Ready to accept commands');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err.message);
});

redisClient.on('close', () => {
  console.log('⚠️  Redis: Connection closed');
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis: Attempting to reconnect...');
});

module.exports = redisClient;
