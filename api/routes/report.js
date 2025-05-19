const express = require('express')
const { reportController } = require('../controllers')

const { checkParamSlug } = require('../middlewares')

const router = express.Router()

const path = '/reports'

router.get(`${path}/social-network-analysis/:slug`, checkParamSlug, reportController.socialNetworkAnalysis)

module.exports = router
