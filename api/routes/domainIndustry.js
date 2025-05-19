const express = require('express')
const { domainIndustryController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkParamSlug, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/domain-industries'

router.get(`${path}-count`, domainIndustryController.count)
router.get(`${path}/`, domainIndustryController.index)
router.get(`${path}/:id`, checkParamId, domainIndustryController.show)
router.get(`${path}-name/:slug`, checkParamSlug, domainIndustryController.showName)
router.get(`${path}/:id/list-keywords`, checkParamId, domainIndustryController.showWithKeyword)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, domainIndustryController.inputValidate, domainIndustryController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, domainIndustryController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, domainIndustryController.inputValidate, domainIndustryController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, domainIndustryController.destroy)

module.exports = router
