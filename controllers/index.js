// import all controller
const userController = require('./userControler')
const categoryController = require('./categoryController')
const productController = require('./productController')
const productCategoryController = require('./productCategoryController')
const profileController = require('./profileController')

// export all controller
module.exports = {
    userController,
    categoryController,
    productController,
    productCategoryController,
    profileController
}