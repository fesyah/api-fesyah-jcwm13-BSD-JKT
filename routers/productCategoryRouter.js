const router = require('express').Router()

const { productCategoryController } = require('../controllers')

router.get('/produk_kategori', productCategoryController.getProductCategory)
router.get('/produk_kategori/details', productCategoryController.getProductCategoryDetails)
router.post('/produk_kategori/add', productCategoryController.addProductCategory)
router.delete('/produk_kategori/delete/:id', productCategoryController.delete)

module.exports = router