const router = require('koa-router')()
const article = require('../controller/article.js')
const collection = require('../controller/collection.js')


router.prefix('/collection')
// router.post('/test/a',collection.collectionwho)

/**
 * 测试接口
 */
router.post('/hass',collection.collectionwho)



/**
 * 添加收藏接口
 */
router.post('/:id',collection.collectionAddAction)
/**
 * 删除收藏记录接口
 */
router.delete('/:id',collection.collectionCancelAction)
/**
 * 获得某个用户收藏记录接口
 */
router.get('/:id',collection.collectionShowAction)


module.exports=router