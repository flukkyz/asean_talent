const express = require('express')
const { scopusController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/scopuses'

router.get(`${path}-count`, scopusController.count)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), scopusController.index)
router.get(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, scopusController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, scopusController.inputValidate, scopusController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, scopusController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, scopusController.inputValidate, scopusController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, scopusController.destroy)

module.exports = router
