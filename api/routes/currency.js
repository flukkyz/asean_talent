const express = require('express')
const { currencyController } = require('../controllers')

const router = express.Router()

const path = '/currencies'

router.get(`${path}-count`, currencyController.count)
router.get(`${path}/`, currencyController.index)
router.get(`${path}/asean`, currencyController.indexAsean)

module.exports = router
