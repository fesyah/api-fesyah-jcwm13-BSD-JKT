const router = require('express').Router()

const { profileController } = require('../controllers')

router.get('/profile/:id', profileController.getProfile)
router.patch('/profile/edit/:id', profileController.editProfile)

module.exports = router