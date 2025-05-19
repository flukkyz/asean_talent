const express = require('express')
const { fundingOrganizationController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/funding-organizations'

router.get(`${path}-count`, passport.authenticate('bearer', { session: false }), fundingOrganizationController.count)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), fundingOrganizationController.index)
router.get(`${path}/:id`, checkParamId, fundingOrganizationController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), upload.single('funding_img'), checkBody, fundingOrganizationController.inputValidate, fundingOrganizationController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, fundingOrganizationController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), upload.single('funding_img'), checkParamId, checkBody, fundingOrganizationController.inputValidate, fundingOrganizationController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, fundingOrganizationController.inputValidate, fundingOrganizationController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, fundingOrganizationController.destroy)

module.exports = router
