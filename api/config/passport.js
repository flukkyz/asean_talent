const passport = require('passport')
const local = require('./strategies/local')
const bearer = require('./strategies/bearer')
const localMember = require('./strategies/localMember')
const bearerMember = require('./strategies/bearerMember')

passport.use(local)
passport.use(bearer)
passport.use('local-member', localMember)
passport.use('bearer-member', bearerMember)

module.exports = passport
