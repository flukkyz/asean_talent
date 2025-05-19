const express = require('express')
const { aseanNetworkController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/asean-networks'

router.get(`${path}-count`, aseanNetworkController.count)
router.get(`${path}/`, aseanNetworkController.index)
router.get(`${path}/:id`, checkParamId, aseanNetworkController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, aseanNetworkController.inputValidate, aseanNetworkController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, aseanNetworkController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, aseanNetworkController.inputValidate, aseanNetworkController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, aseanNetworkController.destroy)

module.exports = router
