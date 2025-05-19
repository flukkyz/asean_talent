const express = require('express')
const { cityController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/cities'

router.get(`${path}-count`, cityController.count)
router.get(`${path}-talents`, cityController.indexByTalent)
router.get(`${path}-labs`, cityController.indexByLab)
router.get(`${path}-trainings`, cityController.indexByTraining)
router.get(`${path}-fundings`, cityController.indexByFunding)
router.get(`${path}-hosts`, cityController.indexByHost)
router.get(`${path}/`, cityController.index)
router.get(`${path}/:id`, checkParamId, cityController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, cityController.inputValidate, cityController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, cityController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, cityController.inputValidate, cityController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, cityController.destroy)

module.exports = router
