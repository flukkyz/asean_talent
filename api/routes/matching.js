const express = require('express')
const { matchingController } = require('../controllers')

const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/matchings'

router.post(`${path}/`, checkBody, matchingController.searchMatching)
router.post(`${path}-lab/`, checkBody, matchingController.searchLabMatching)
router.post(`${path}-training/`, checkBody, matchingController.searchTrainingMatching)
router.post(`${path}-funding/`, checkBody, matchingController.searchFundingMatching)
router.post(`${path}-publication/`, checkBody, matchingController.searchPublicationMatching)
router.post(`${path}-host/`, checkBody, matchingController.searchHostMatching)
router.get(`${path}/:id`, checkParamId, matchingController.showTalentProfile)
router.get(`${path}/:id/recommendations`, checkParamId, matchingController.recommendation)
router.get(`${path}-lab/:id/recommendations`, checkParamId, matchingController.recommendationLab)
router.get(`${path}-training/:id/recommendations`, checkParamId, matchingController.recommendationTraining)
router.get(`${path}-funding/:id/recommendations`, checkParamId, matchingController.recommendationFunding)
router.get(`${path}-publication/:id/recommendations`, checkParamId, matchingController.recommendationPublication)
router.get(`${path}-host/:id/recommendations`, checkParamId, matchingController.recommendationHost)

module.exports = router
