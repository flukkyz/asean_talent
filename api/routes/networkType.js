const express = require('express')
const { networkTypeController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/network-types'

router.get(`${path}-count`, networkTypeController.count)
router.get(`${path}/`, networkTypeController.index)
router.get(`${path}-asean-networks`, networkTypeController.indexByAseanNetwork)
router.get(`${path}/:id`, checkParamId, networkTypeController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, networkTypeController.inputValidate, networkTypeController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, networkTypeController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, networkTypeController.inputValidate, networkTypeController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, networkTypeController.destroy)

module.exports = router
