const router = require('koa-router')()
const article = require('../controller/article.js')
const collection = require('../controller/collection.js')


router.prefix('/collection')
// router.post('/test/a',collection.collectionwho)
router.post('/hass',collection.collectionwho)
router.post('/:id',collection.collectionAddAction)
router.delete('/:id',collection.collectionCancelAction)
router.get('/:id',collection.collectionShowAction)

module.exports=router