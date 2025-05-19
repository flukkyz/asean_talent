const express = require('express')
const { machineDetailController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/machine-details'

router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkBody, machineDetailController.inputValidate, machineDetailController.store)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, machineDetailController.inputValidate, machineDetailController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, machineDetailController.destroy)

module.exports = router
