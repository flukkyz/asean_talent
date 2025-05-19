const express = require('express')
const { countryController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/countries'

router.get(`${path}-count`, countryController.count)
router.get(`${path}-talents`, countryController.indexByTalent)
router.get(`${path}-labs`, countryController.indexByLab)
router.get(`${path}-trainings`, countryController.indexByTraining)
router.get(`${path}-fundings`, countryController.indexByFunding)
router.get(`${path}-publishers`, countryController.indexByPublisher)
router.get(`${path}-hosts`, countryController.indexByHost)
router.get(`${path}/`, countryController.index)
router.get(`${path}/:id`, checkParamId, countryController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, countryController.inputValidate, countryController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, countryController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, countryController.inputValidate, countryController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, countryController.destroy)

module.exports = router
