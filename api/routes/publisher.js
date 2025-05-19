const express = require('express')
const { publisherController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/publishers'

router.get(`${path}-count`, passport.authenticate('bearer', { session: false }), publisherController.count)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), publisherController.index)
router.get(`${path}/:id`, checkParamId, publisherController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkBody, publisherController.inputValidate, publisherController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, publisherController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, publisherController.inputValidate, publisherController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, publisherController.destroy)

module.exports = router
