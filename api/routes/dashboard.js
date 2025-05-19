const express = require('express')
const { dashboardController } = require('../controllers')

const router = express.Router()

const path = '/dashboards'

router.get(`${path}/count-talents-group-industry`, dashboardController.countTalentGroupIndustry)
router.get(`${path}/count-talents-group-country`, dashboardController.countTalentGroupCountry)
router.get(`${path}/count-talents-group-industry-country`, dashboardController.countTalentGroupIndustryAndCountry)

module.exports = router
