const express = require('express')
const { supportController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/supports'

router.get(`${path}/`, supportController.index)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, upload.single('support_img'), checkBody, supportController.inputValidate, supportController.store)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, upload.single('support_img'), checkParamId, checkBody, supportController.inputValidate, supportController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, supportController.inputValidate, supportController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, supportController.destroy)

module.exports = router
