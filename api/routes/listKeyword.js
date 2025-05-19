const express = require('express')
const { listKeywordController } = require('../controllers')

const router = express.Router()

const path = '/list-keywords'

router.get(`${path}-count`, listKeywordController.count)
router.get(`${path}-popular`, listKeywordController.indexPopular)
router.get(`${path}/`, listKeywordController.index)

module.exports = router
