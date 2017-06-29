let article = require('./article.js')
let koauser = require('./user.js').koauser;
let reply = require('./reply.js')
let star = require('./star.js')
let collection = require('./collection.js')
let log = require('../utils/log.js')
let mongoose = require('mongoose')
let mongoUrl = 'mongodb://127.0.0.1';
mongoose.Promise = global.Promise;

mongoose.connect(mongoUrl);

let db = mongoose.connection;

db.on('error', (err)=>{
    log.error("connect error:", err);
});

db.once('open', () => {
    log.info('MongoDB is ready')
});

module.exports = {
    article,
    collection,
    reply,
    star,
    koauser
}

