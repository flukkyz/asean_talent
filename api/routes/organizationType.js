const express = require('express')
const { organizationTypeController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/organization-types'

router.get(`${path}-count`, organizationTypeController.count)
router.get(`${path}-labs`, organizationTypeController.indexByLab)
router.get(`${path}-trainings`, organizationTypeController.indexByTraining)
router.get(`${path}/`, organizationTypeController.index)
router.get(`${path}/:id`, checkParamId, organizationTypeController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, organizationTypeController.inputValidate, organizationTypeController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, organizationTypeController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, organizationTypeController.inputValidate, organizationTypeController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, organizationTypeController.destroy)

module.exports = router
