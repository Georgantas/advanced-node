
const redis = require('redis');

const redisUrl = 'redis://127.0.0.1:6379';

const client = redis.createClient(redisUrl);

client.set('hi', 'there'); // returns true to indicate success

client.get('hi', (err, value) => console.log(value));

client.get('hi', console.log); // returns null (no error) and 'there'

client.hset('spanish', 'red', 'rojo'); // store object 'spanish' with key 'red' and value 'rojo'

client.hget('spanish', 'red', console.log);

client.set('colors', JSON.stringify({ red: 'rojo' }));

client.get('colors', console.log);

client.get('colors', (err, val) => console.log(JSON.parse(val)));

client.flushall(); // deletes all data in redis

client.set('color', 'red', 'EX', 5); // expires after 5 seconds
