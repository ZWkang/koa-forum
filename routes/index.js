const router = require('koa-router')()

const indexfunc = require('../controller/datagetter.js').indexShowAction

const goodfunc = require('../controller/datagetter.js').goodtoArticle
router.get('/test/:id', async (ctx, next) => {
  // await ctx.render('index', {
  //   title: 'Hello Koa 2!'
  // })
  // ctx.response.status=401;
  // console.log(ctx.request.body)
  ctx.body='123';
});
// router.get('/', indexfunc)
router.get('/list', indexfunc);

router.put('/top/article/:id',goodfunc)

module.exports = router
