const express = require('express')
const { publicationController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/publications'

router.get(`${path}-count`, passport.authenticate('bearer', { session: false }), publicationController.count)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), publicationController.index)
router.get(`${path}/:id`, checkParamId, publicationController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), upload.single('publication_img'), checkBody, publicationController.inputValidate, publicationController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, publicationController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), upload.single('publication_img'), checkParamId, checkBody, publicationController.inputValidate, publicationController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, publicationController.inputValidate, publicationController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, publicationController.destroy)

module.exports = router
