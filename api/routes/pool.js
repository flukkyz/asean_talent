const express = require('express')
const { poolController } = require('../controllers')

const { checkParamKey, checkParamSlug, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/pools'

router.get(`${path}/countries/:slug`, checkParamSlug, poolController.searchByCountryIndustry)
router.get(`${path}/:key/:slug`, checkParamKey, checkParamSlug, poolController.searchByKeyword)
router.get(`${path}/talent/:key/:id`, checkParamKey, checkParamId, poolController.getTalentUrl)

module.exports = router
