const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost, //grabbed from keys.js. Connecting client to the redis host
    port: keys.redisPort, //grabbed from keys.js
    retry_strategy: () => 1000 //retry connecting once every 1000 ms if we lose connection
});

const sub = redisClient.duplicate(); //sub stands for subscription

function fib(index) {
    if (index < 2) return 1; //so return 1 if the fibonacci index is 1
    return fib(index - 1) + fib(index - 2) //return this equation to get fibonacci number for index > 2 by using recursive solution
};

sub.on('message', (channel,message) => {
    redisClient.hset('values', message, fib(parseInt(message)))
});

sub.subscribe('insert');