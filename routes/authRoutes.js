const { Router } = require('express')
const authController = require('../controller/authController')

const router = Router()

router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login' , authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)
router.post('/deletePokomon', authController.deletePokomon_post)
router.post('/pokomonReg', authController.pokomonReg_post)
router.get('/pokomonReg', authController.pokomonReg_get)
router.get('/:id', authController.id_get)
router.get('/home/:id', authController.homeUser_get)
router.post('/updatePokomon', authController.updatePokomon_post)


module.exports = router