const express = require('express')
const { authController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamToken, checkParamKey } = require('../middlewares')

const router = express.Router()

const path = '/auth'

router.post(`${path}/signup`, checkBody, authController.signup)
router.post(`${path}/resend-verify`, checkBody, authController.resendVerify)
router.post(`${path}/verify`, checkBody, authController.verify)

router.post(`${path}/forgot-password`, checkBody, authController.forgotPassword)
router.post(`${path}/check-password-token`, checkBody, authController.checkPasswordToken)
router.put(`${path}/reset-password/:token`, checkParamToken, checkBody, authController.resetPassword)

router.get(`${path}/oauth/:key`, checkParamKey, authController.oauth)
router.get(`${path}/callback/:key`, checkParamKey, authController.callback)

router.post(`${path}/login`, passport.authenticate('local-member', { session: false }), authController.login)

router.get(`${path}/me`, passport.authenticate('bearer-member', { session: false }), authController.me)
router.post(`${path}/update-profile`, passport.authenticate('bearer-member', { session: false }), checkBody, authController.updateProfile)
router.post(`${path}/update-researcher`, passport.authenticate('bearer-member', { session: false }), checkBody, authController.updateResearcherProfile)
router.post(`${path}/update-organization`, passport.authenticate('bearer-member', { session: false }), checkBody, authController.updateOrganizationProfile)
router.post(`${path}/update-data-privacy`, passport.authenticate('bearer-member', { session: false }), checkBody, authController.updateDataPrivacyProfile)
router.post(`${path}/update-password`, passport.authenticate('bearer-member', { session: false }), checkBody, authController.updatePassword)
router.post(`${path}/update-avatar`, passport.authenticate('bearer-member', { session: false }), upload.single('avatar_img'), authController.updateAvatar)
router.post(`${path}/add-cv`, upload.single('cv_img'), checkBody, authController.addCV)
router.post(`${path}/remove-token`, checkBody, authController.removeTempToken)
router.post(`${path}/update-cv`, passport.authenticate('bearer-member', { session: false }), upload.single('cv_img'), authController.updateCV)
router.post(`${path}/token`, checkBody, authController.token)

router.delete(`${path}/logout`, passport.authenticate('bearer-member', { session: false }), authController.logout)

module.exports = router
