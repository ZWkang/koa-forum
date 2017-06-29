const router = require('koa-router')()
const regist = require('../controller/register.js')
const login = require('../controller/login.js')
const userinfo = require('../controller/datagetter.js').userinfo
router.prefix('/users')

router.post('/register', regist.registerAction)
router.post('/login',login.LoginAction)
router.get('/info/:id',userinfo)
module.exports = router
