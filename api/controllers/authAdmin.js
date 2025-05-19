const randomstring = require('randomstring')
const dayjs = require('dayjs')
const bcryptjs = require('bcryptjs')
const db = require('../models')
const mailer = require('../config/mailer')

const Op = db.Sequelize.Op
const User = db.User
const AccessToken = db.AccessToken

const findByEmail = async (email, res, include = []) => {
  const where = {
    email
  }
  const data = await User.findOne({
    where,
    include
  })
  return data
}

const findByResetPasswordToken = async (passwordResetToken, res, include = []) => {
  const where = {
    password_reset_token: passwordResetToken,
    password_reset_expire_at: {
      [Op.gte]: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  }
  const data = await User.findOne({
    where,
    include
  })
  return data
}

const updateUser = async (id, data, res) => {
  try {
    return await db.sequelize.transaction((t) => {
      return User.update(
        data,
        {
          where: {
            id
          }
        },
        {
          transaction: t
        }
      )
    })
  } catch (e) {
    return res.status(500).json({
      message: 'Cannot store data to database.' + e
    })
  }
}

const sendMail = async (to, subject, html) => {
  try {
    const mail = await mailer.sendMail({
      from: `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`,
      to,
      subject,
      html
    })
    console.log(mail.messageId)
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  forgotPassword: async (req, res, next) => {
    const body = req.body
    try {
      const data = await findByEmail(body.email, res)
      if (!data) {
        return res.status(404).json({
          message: 'Not Found'
        })
      }
      const passwordResetToken = randomstring.generate(64)
      const updateData = {
        password_reset_token: passwordResetToken,
        password_reset_expire_at: dayjs().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      }
      await updateUser(data.id, updateData, res)
      await sendMail(data.email, 'Reset Password', `Reset Password click <a href="${process.env.BASE_URL}/backend/reset-password/${passwordResetToken}" target="_blank" rel="Reset Password">${process.env.BASE_URL}/backend/reset-password/${passwordResetToken}</a>`)
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  checkPasswordToken: async (req, res, next) => {
    const body = req.body
    try {
      const data = await findByResetPasswordToken(body.token, res)
      if (!data) {
        return res.status(404).json({
          message: 'Not Found'
        })
      }
      return res.status(204).send()
    } catch (e) {
      e.message = 'Error: ' + e
      next(e)
    }
  },
  resetPassword: async (req, res, next) => {
    const token = req.params.token
    const body = req.body
    try {
      const data = await findByResetPasswordToken(token, res)
      if (!data) {
        return res.status(404).json({
          message: 'Not Found'
        })
      }
      const salt = bcryptjs.genSaltSync(10)
      const updateData = {
        salt,
        password: bcryptjs.hashSync(body.password, salt),
        password_reset_expire_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      if (!data.password_created_at) {
        updateData.password_created_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      if (!data.verify_at) {
        updateData.verify_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      await updateUser(data.id, updateData, res)
      return res.status(204).send()
    } catch (e) {
      e.message = 'Error: ' + e
      next(e)
    }
  },
  login: async (req, res, next) => {
    try {
      const newRefreshToken = randomstring.generate(128)
      await db.sequelize.transaction((t) => {
        return User.update(
          {
            refresh_token: newRefreshToken,
            refresh_token_expire_at: dayjs().add(10, 'hours').format('YYYY-MM-DD HH:mm:ss')
          }, {
            where: {
              id: req.user.id
            }
          }, {
            transaction: t
          }
        )
      })

      const data = {
        user_id: req.user.id,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }

      const newData = await db.sequelize.transaction((t) => {
        return AccessToken.create(data, {
          transaction: t
        }
        )
      })
      return res.status(200).json({
        access_token: newData.access_token,
        refresh_token: newRefreshToken
      })
    } catch (e) {
      next(e)
    }
  },
  token: async (req, res, next) => {
    const refreshToken = req.body.refresh_token
    if (refreshToken) {
      try {
        const refresh = await User.findOne({
          where: {
            refresh_token: refreshToken,
            refresh_token_expire_at: {
              [Op.gte]: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
          }
        })
        if (refresh) {
          const data = {
            user_id: refresh.id,
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
          }
          try {
            const newData = await db.sequelize.transaction((t) => {
              return AccessToken.create(data, {
                transaction: t
              }
              )
            })
            return res.status(200).json({
              access_token: newData.access_token
            })
          } catch (e) {
            next(e)
          }
        }
      } catch (e) {
        return res.status(401).json({
          message: 'Unauthorized' + e
        })
      }
    }
    return res.status(400).json({
      message: 'Bad request'
    })
  },
  me: (req, res) => {
    return res.status(200).json({
      user: {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        country: req.user.Country ? req.user.Country.name : null
      }
    })
  },
  updateProfile: async (req, res, next) => {
    const data = req.body
    try {
      await updateUser(req.user.id, data, res)
    } catch (e) {
      e.message = 'Error: ' + e
      next(e)
    }
    return res.status(204).send()
  },
  updatePassword: async (req, res, next) => {
    const body = req.body
    try {
      const data = await findByEmail(req.user.email, res)
      if (!data) {
        return res.status(404).json({
          message: 'Not Found'
        })
      }
      if (!data.password_created_at || (!!data.password_created_at && data.validPassword(body.old_password))) {
        const salt = bcryptjs.genSaltSync(10)
        const updateData = {
          salt,
          password: bcryptjs.hashSync(body.password, salt)
        }
        if (!data.password_created_at) {
          updateData.password_created_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        await updateUser(data.id, updateData, res)
        return res.status(204).send()
      }
      return res.status(401).json({
        message: 'Unauthorized'
      })
    } catch (e) {
      e.message = 'Error: ' + e
      next(e)
    }
  },
  logout: async (req, res, next) => {
    try {
      await db.sequelize.transaction((t) => {
        return User.update(
          {
            refresh_token: null,
            refresh_token_expire_at: null
          }, {
            where: {
              id: req.user.id
            }
          }, {
            transaction: t
          }
        )
      })
    } catch (e) {
      next(e)
    }
    return res.status(204).json({ status: 'success' })
  }
}
