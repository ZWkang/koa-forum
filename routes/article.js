const router = require('koa-router')()
const article = require('../controller/article.js')
const reply = require('../controller/reply.js')
const collection = require('../controller/collection.js')
const star = require('../controller/star.js')

router.prefix('/article')

router.get('/:id',article.articleGetAction)
/**
 * @param authorization 登录后保存的token
 * @param :id 文章的article值
 */
router.post('/',article.articlePostAction)
router.put('/:id',article.articlePutAction)
/**
 * @param authorization 登录后保存的token
 * @param :id 文章的article值
 */
router.delete('/:id',article.articleDeleteAction)
/**
 * @param post authorization 登录后保存的token
 * @param :id 评论的id值
 */

router.post('/:id/reply',reply.replyAddAction)
/**
 * @param post authorization 登录后保存的token
 * @param :id 评论的id值
 */
router.delete('/reply/:id',reply.replyDeleteAction)


// router.post('/:id/collect',collection.collectionAddAction);

// router.delete('/:id/cancel_collect',collection.collectionCancelAction);

//点赞
router.post('/star/:id/ups',star.starAction)


module.exports = router