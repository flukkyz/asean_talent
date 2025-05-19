const express = require('express')
const { departmentController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/departments'

router.get(`${path}-count`, departmentController.count)
router.get(`${path}-fundings`, departmentController.indexByFunding)
router.get(`${path}/`, departmentController.index)
router.get(`${path}/:id`, checkParamId, departmentController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, departmentController.inputValidate, departmentController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, departmentController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, departmentController.inputValidate, departmentController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, departmentController.destroy)

module.exports = router
