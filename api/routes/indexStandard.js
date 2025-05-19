const express = require('express')
const { indexStandardController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/index-standards'

router.get(`${path}-count`, indexStandardController.count)
router.get(`${path}/`, indexStandardController.index)
router.get(`${path}/:id`, checkParamId, indexStandardController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, indexStandardController.inputValidate, indexStandardController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, indexStandardController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, indexStandardController.inputValidate, indexStandardController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, indexStandardController.destroy)

module.exports = router
