const express = require('express')
const { topbarLogoController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/topbar-logos'

router.get(`${path}/`, topbarLogoController.index)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, upload.single('topbar_logo_img'), checkBody, topbarLogoController.inputValidate, topbarLogoController.store)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, upload.single('topbar_logo_img'), checkParamId, checkBody, topbarLogoController.inputValidate, topbarLogoController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, topbarLogoController.inputValidate, topbarLogoController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, topbarLogoController.destroy)

module.exports = router
