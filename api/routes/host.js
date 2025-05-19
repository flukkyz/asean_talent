const express = require('express')
const { hostController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/hosts'

router.get(`${path}-count`, passport.authenticate('bearer', { session: false }), hostController.count)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), hostController.index)
router.get(`${path}/:id`, checkParamId, hostController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), upload.single('host_img'), checkBody, hostController.inputValidate, hostController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, hostController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), upload.single('host_img'), checkParamId, checkBody, hostController.inputValidate, hostController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, hostController.inputValidate, hostController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, hostController.destroy)

module.exports = router
