const express = require('express')
const { authAdminController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamToken } = require('../middlewares')

const router = express.Router()

const path = '/auth-admin'

router.post(`${path}/login`, passport.authenticate('local', { session: false }), authAdminController.login)
router.get(`${path}/me`, passport.authenticate('bearer', { session: false }), authAdminController.me)
router.post(`${path}/token`, checkBody, authAdminController.token)
router.delete(`${path}/logout`, passport.authenticate('bearer', { session: false }), authAdminController.logout)

router.post(`${path}/update-profile`, passport.authenticate('bearer', { session: false }), checkBody, authAdminController.updateProfile)
router.post(`${path}/update-password`, passport.authenticate('bearer', { session: false }), checkBody, authAdminController.updatePassword)

router.post(`${path}/forgot-password`, checkBody, authAdminController.forgotPassword)
router.post(`${path}/check-password-token`, checkBody, authAdminController.checkPasswordToken)
router.put(`${path}/reset-password/:token`, checkParamToken, checkBody, authAdminController.resetPassword)

module.exports = router
