const router = require('express').Router()

const { categoryController } = require('../controllers')

router.get('/category', categoryController.getCategory)
router.post('/category', categoryController.addCategory)
router.get('/category/details', categoryController.getCategoryDetails)
router.get('/category/details/:id', categoryController.getCategoryDetailsById)
router.delete('/category/:id', categoryController.delete)
router.get('/category2', categoryController.getCategoryByQuery)
router.get('/category/nodes', categoryController.getLeafNodes)
router.patch('/category/edit/:id', categoryController.editCategory)


module.exports = router