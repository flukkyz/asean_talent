const express = require('express')
const { industryKeywordController } = require('../controllers')

const router = express.Router()

const path = '/industry-keywords'

router.get(`${path}`, industryKeywordController.index)

module.exports = router
