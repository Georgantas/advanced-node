
const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.hashKey || '');
    this.expireTime = options.expireTime || 0;

    return this;
}

mongoose.Query.prototype.exec = async function() {
    if(!this.useCache){
        return exec.apply(this, arguments);
    }

    // console.log("I'm about to run a query.");

    // // These two properties are unique to every call, so they will be used as keys
    // console.log(this.getQuery());
    // console.log(this.mongooseCollection.name);

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // See if we have a value for 'key' in redis
    // Note: This will return a JSON string, not a mongoose document. Must hydrate.
    const cacheValue = await client.hget(this.hashKey, key);

    // If we do, return that
    if(cacheValue){
        // console.log(cacheValue);
        console.log('returning cached value')
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc)
        ? doc.map(d => new this.model(d))
        : new this.model(doc);
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);

    // OPINION: USE SET INSTEAD IN PRODUCTION OR MAKE THE EXPIRE TIME WORK ON 'KEY' INSTEAD OF HASHKEY
    client.hset(this.hashKey, key, JSON.stringify(result));

    if(this.expireTime){
        client.expire(this.hashKey, this.expireTime);
    }

    // console.log(result);
    return result;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}
