const redis = require("redis");

const connectRedisDB = () => {
  const config = {
    url: process.env.REDIS_URL,
  };
  const client = redis.createClient(config);

  client.on("connect", function () {
    console.log("Redis connection established!");
  });

  client.on("error", function (error) {
    console.error(error);
  });

  return client;
};

module.exports = connectRedisDB;
