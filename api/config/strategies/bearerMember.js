const BearerStrategy = require('passport-http-bearer').Strategy
const dayjs = require('dayjs')
const db = require('../../models')
const Op = db.Sequelize.Op
const MemberAccessToken = db.MemberAccessToken
const Member = db.Member
const Organization = db.Organization
const Researcher = db.Researcher
const DataPrivacy = db.DataPrivacy
const OrganizationType = db.OrganizationType
const Country = db.Country

module.exports = new BearerStrategy(async (token, done) => {
  try {
    const access = await MemberAccessToken.findOne({
      where: {
        access_token: token,
        expire_at: {
          [Op.gte]: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      },
      include: {
        model: Member,
        attributes: {
          exclude: [
            'password', 'salt', 'password_reset_expire_at', 'password_reset_token', 'active', 'facebook_id', 'google_id', 'organization_id', 'refresh_token', 'refresh_token_expire_at', 'researcher_id', 'data_privacy_id', 'updatedAt', 'verify_at', 'verify_token', 'temp_token',
            'link_scopus',
            'link_linkedin',
            'research_gate',
            'cv',
            'patient'
          ]
        },
        include: [
          {
            model: Organization,
            include: [
              Country,
              OrganizationType
            ]
          },
          DataPrivacy,
          {
            model: Researcher,
            include: [
              Country,
              {
                model: Country,
                as: 'GraduateCountry'
              }
            ]
          }
        ]
      }

    })
    if (access) {
      return done(null, access.Member)
    }
  } catch (e) {
    console.log(e)
  }
  return done(null, false)
}
)
