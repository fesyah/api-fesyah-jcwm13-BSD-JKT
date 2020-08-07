const router = require('express').Router()
const { validator, validatePassword } = require('../helpers/validator')
const { verify } = require('../helpers/jwt')

const { userController } = require('../controllers')

router.get('/users', userController.getUserData)
router.post('/login', userController.login)
router.post('/register', validator, userController.register)
router.delete('/users/:id', userController.delete)
router.patch('/users/:id', userController.edit)
router.patch('/users/pass/:id', validatePassword, userController.editPass)
router.post('/users/keeplogin', verify, userController.keeplogin)

module.exports = router