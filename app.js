const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const articles = require('./routes/article')
const collection = require('./routes/collect')
const cors = require('kcors');

const log = require('./utils/log.js')
const jwt = require('jsonwebtoken')
const jwtcheck = require('./utils/getheader')



console.log(app)

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(cors())

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  log.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// app.use(jwt({
//   secret: 'koa-test'
// }));
// routes
app.use(jwtcheck({"forget":true}))
// app.use(async (ctx, next) => {
//   console.log(ctx._tokens)
//   return next()
// })
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(articles.routes(),articles.allowedMethods())
app.use(collection.routes(),collection.allowedMethods())
// const token = jwt.sign({
//         uid: '123',
//         name: 'kang',
//         exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 //1 hours
//       }, 'kang');
// console.log(token)
// console.log(jwt.verify(token,'kang'))
module.exports = app
