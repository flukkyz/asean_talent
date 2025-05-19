const express = require('express')
const { keywordController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/keywords'

router.get(`${path}-count`, keywordController.count)
router.get(`${path}/`, keywordController.index)
router.get(`${path}/:id`, checkParamId, keywordController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, keywordController.inputValidate, keywordController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, keywordController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, keywordController.inputValidate, keywordController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, keywordController.destroy)

module.exports = router
