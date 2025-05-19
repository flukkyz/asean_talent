const express = require('express')
const { labLocationController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/lab-locations'

router.get(`${path}-count`, passport.authenticate('bearer', { session: false }), labLocationController.count)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), labLocationController.index)
router.get(`${path}/:id`, checkParamId, labLocationController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), upload.single('lab_img'), checkBody, labLocationController.inputValidate, labLocationController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, labLocationController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), upload.single('lab_img'), checkParamId, checkBody, labLocationController.inputValidate, labLocationController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, labLocationController.inputValidate, labLocationController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, labLocationController.destroy)

module.exports = router
