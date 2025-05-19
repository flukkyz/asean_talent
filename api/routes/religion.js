const express = require('express')
const { religionController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/religions'

router.get(`${path}-count`, religionController.count)
router.get(`${path}/`, religionController.index)
router.get(`${path}/:id`, checkParamId, religionController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, religionController.inputValidate, religionController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, religionController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, religionController.inputValidate, religionController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, religionController.destroy)

module.exports = router
