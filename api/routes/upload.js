const express = require('express')
const { uploadController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/uploads'

router.post(`${path}/cities`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, uploadController.storeCity)
router.post(`${path}/countries`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, uploadController.storeCountry)
router.post(`${path}/universities`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, uploadController.storeUniversity)
router.post(`${path}/talents`, passport.authenticate('bearer', { session: false }), checkBody, uploadController.storeTalent)
router.post(`${path}/young-talents`, passport.authenticate('bearer', { session: false }), checkBody, uploadController.storeYoungTalent)
router.post(`${path}/co-authors`, passport.authenticate('bearer', { session: false }), checkBody, uploadController.storeCoAuthor)
router.post(`${path}/match-companies`, passport.authenticate('bearer', { session: false }), checkBody, uploadController.storeMatchCompany)
router.post(`${path}/funding-organizations`, passport.authenticate('bearer', { session: false }), checkBody, uploadController.storeFundingOrganization)
router.post(`${path}/lab-locations`, passport.authenticate('bearer', { session: false }), checkBody, uploadController.storeLabLocation)
router.post(`${path}/training-courses`, passport.authenticate('bearer', { session: false }), checkBody, uploadController.storeTrainingCourse)
router.post(`${path}/hosts`, passport.authenticate('bearer', { session: false }), checkBody, uploadController.storeHost)
router.post(`${path}/update-scopuses`, passport.authenticate('bearer', { session: false }), checkBody, uploadController.updateScopus)

router.post(`${path}/talent-image`, passport.authenticate('bearer', { session: false }), upload.single('talent_img'), uploadController.storeImage)
router.post(`${path}/funding-organizations-image`, passport.authenticate('bearer', { session: false }), upload.single('funding_img'), uploadController.storeImage)
router.post(`${path}/lab-locations-image`, passport.authenticate('bearer', { session: false }), upload.single('lab_img'), uploadController.storeImage)
router.post(`${path}/training-courses-image`, passport.authenticate('bearer', { session: false }), upload.single('training_img'), uploadController.storeImage)
router.post(`${path}/hosts-image`, passport.authenticate('bearer', { session: false }), upload.single('host_img'), uploadController.storeImage)
router.post(`${path}/match-companies-image`, passport.authenticate('bearer', { session: false }), upload.single('company_img'), uploadController.storeImage)

module.exports = router
