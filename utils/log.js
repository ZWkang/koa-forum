var log4js = require('log4js')
var LOG_PATH = require('../config/index.js')['LOG_PATH']||{}
log4js.configure({
  appenders: [
    {
      type: 'file', 
      filename: LOG_PATH['access']||'logs/access.log', 
      maxLogSize: 102400,
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      backups:3
    },{
      type: 'file', 
      filename: LOG_PATH['error']||'logs/error.log', 
      maxLogSize: 102400,
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      backups:3
    },{ type: 'console' }
  ]
})

let log = log4js.getLogger('koa-blog')

log.setLevel('AUTO')
module.exports = log