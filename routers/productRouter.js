const router = require('express').Router()

const { productController } = require('../controllers')

router.get('/produk', productController.getProducts)
router.get('/produk/:id', productController.getProductById)
router.patch('/produk/edit/:id', productController.editProduct)
router.delete('/produk/delete/:id', productController.delete)
router.post('/produk/add', productController.add)

module.exports = router