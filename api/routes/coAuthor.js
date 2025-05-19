const express = require('express')
const { coAuthorController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/co-authors'

router.get(`${path}-count`, coAuthorController.count)
router.get(`${path}/`, coAuthorController.index)
router.get(`${path}/:id`, checkParamId, coAuthorController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, coAuthorController.inputValidate, coAuthorController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, coAuthorController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, coAuthorController.inputValidate, coAuthorController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, coAuthorController.destroy)

module.exports = router
