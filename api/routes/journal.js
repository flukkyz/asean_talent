const express = require('express')
const { journalController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/journals'

router.get(`${path}-count`, passport.authenticate('bearer', { session: false }), journalController.count)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), journalController.index)
router.get(`${path}/:id`, checkParamId, journalController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkBody, journalController.inputValidate, journalController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, journalController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, journalController.inputValidate, journalController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, journalController.destroy)

module.exports = router
