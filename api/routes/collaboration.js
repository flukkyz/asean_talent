const express = require('express')
const { collaborationController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/collaborations'

router.get(`${path}-count`, collaborationController.count)
router.get(`${path}/`, collaborationController.index)
router.get(`${path}/:id`, checkParamId, collaborationController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, collaborationController.inputValidate, collaborationController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, collaborationController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, collaborationController.inputValidate, collaborationController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, collaborationController.destroy)

module.exports = router
