const express = require('express')
const { universityController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/universities'

router.get(`${path}-count`, universityController.count)
router.get(`${path}-talents`, universityController.indexByTalent)
router.get(`${path}-labs`, universityController.indexByLab)
router.get(`${path}-trainings`, universityController.indexByTraining)
router.get(`${path}/`, universityController.index)
router.get(`${path}/:id`, checkParamId, universityController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, universityController.inputValidate, universityController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, universityController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, universityController.inputValidate, universityController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, universityController.destroy)

module.exports = router
