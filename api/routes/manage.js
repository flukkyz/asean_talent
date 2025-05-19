const express = require('express')
const { manageController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/manages'

router.get(`${path}/`, manageController.index)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, upload.single('manage_img'), checkBody, manageController.inputValidate, manageController.store)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, upload.single('manage_img'), checkParamId, checkBody, manageController.inputValidate, manageController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, manageController.inputValidate, manageController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, manageController.destroy)

module.exports = router
