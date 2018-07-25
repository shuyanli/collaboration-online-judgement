var redis = require('redis');
var client = redis.createClient();  //create singleton of redis client

function set (key, value, callback) {
    client.set(key, value, (err, res) => {
        if (err) {
            console.log('error in redis get :' + err);
        }
        console.log('key is: '+ key);
        callback(res);
    });
};

function get (key ,callback) {
    client.get (key, (err, res) =>{
        if (err) {
            console.log('cannot get the value with key: ' + key);
            return;
        }
        console.log('key is: '+ key);
        callback(res);
    });
};

function expire (key, timeInSeconds) {
    console.log('key is: '+ key);
    client.expire(key, timeInSeconds);  //todo 例子里用的expire而不是expires, 但是文件里说是expire
}

function quit () {
    client.quit();
}

module.exports = {
    get: get,
    set: set,
    expire: expire,
    quit: quit,
    redisPrint: redis.print // directly export the function in redis
}