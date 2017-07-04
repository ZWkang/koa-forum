const router = require('koa-router')()
const article = require('../controller/article.js')
const reply = require('../controller/reply.js')
const collection = require('../controller/collection.js')
const star = require('../controller/star.js')

router.prefix('/article')


/**
 * 获取文章信息
 */
router.get('/:id',article.articleGetAction)
/**
 * 提交文章接口
 */
router.post('/',article.articlePostAction)
/**
 * 更新文章接口
 */
router.put('/:id',article.articlePutAction)
/**
 * 删除文章接口
 */
router.delete('/:id',article.articleDeleteAction)
/**
 * 回复某一篇文章
 */

router.post('/:id/reply',reply.replyAddAction)
/**
 * 删除某一条评论
 */
router.delete('/reply/:id',reply.replyDeleteAction)


/**
 * 点赞某一条评论
 */
router.post('/star/:id/ups',star.starAction)


module.exports = router