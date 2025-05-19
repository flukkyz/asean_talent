const express = require('express')
const { portalController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/portals'

router.get(`${path}-count`, portalController.count)
router.get(`${path}/`, portalController.index)
router.get(`${path}/:id`, checkParamId, portalController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, portalController.inputValidate, portalController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, portalController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, portalController.inputValidate, portalController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, portalController.destroy)

module.exports = router
