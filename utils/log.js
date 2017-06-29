var log4js = require('log4js')

log4js.configure({
  appenders: [
    { type: 'console' },{
      type: 'file', 
      filename: 'logs/access.log', 
      maxLogSize: 102400,
      backups:3
      // category: 'normal' 
    }
  ]
})

let log = log4js.getLogger('koa-blog')

log.setLevel('AUTO')
module.exports = log