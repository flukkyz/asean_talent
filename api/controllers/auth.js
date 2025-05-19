const fs = require('fs')
const path = require('path')
const randomstring = require('randomstring')
const bcryptjs = require('bcryptjs')
const dayjs = require('dayjs')
const axios = require('axios')
const sharp = require('sharp')
const db = require('../models')
const mailer = require('../config/mailer')

const Op = db.Sequelize.Op
const Member = db.Member
const Researcher = db.Researcher
const DataPrivacy = db.DataPrivacy
const Organization = db.Organization
const MemberAccessToken = db.MemberAccessToken

const findByVerifyToken = async (verifyToken, res, include = []) => {
  const where = {
    verify_token: verifyToken,
    verify_at: null
  }
  const data = await Member.findOne({
    where,
    include
  })
  return data || res.status(404).json({
    message: 'Not Found'
  })
}
const findByTempToken = async (verifyToken, res, include = []) => {
  const where = {
    temp_token: verifyToken,
    verify_at: null
  }
  const data = await Member.findOne({
    where,
    include
  })
  return data || res.status(404).json({
    message: 'Not Found'
  })
}
const findByResetPasswordToken = async (passwordResetToken, res, include = []) => {
  const where = {
    password_reset_token: passwordResetToken,
    password_reset_expire_at: {
      [Op.gte]: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  }
  const data = await Member.findOne({
    where,
    include
  })
  return data || res.status(404).json({
    message: 'Not Found'
  })
}
const findByEmail = async (email, res, include = []) => {
  const where = {
    email
  }
  const data = await Member.findOne({
    where,
    include
  })
  return data || res.status(404).json({
    message: 'Not Found'
  })
}

const createMember = async (data, res) => {
  try {
    return await db.sequelize.transaction((t) => {
      return Member.create(data, {
        include: [
          Researcher,
          DataPrivacy,
          Organization
        ],
        transaction: t
      })
    })
  } catch (e) {
    return res.status(500).json({
      message: 'Cannot store data to database.' + e
    })
  }
}
const updateMember = async (id, data, res) => {
  try {
    return await db.sequelize.transaction((t) => {
      return Member.update(
        data, {
          where: {
            id
          }
        }, {
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
const updateResearcher = async (id, data, res) => {
  try {
    return await db.sequelize.transaction((t) => {
      return Researcher.update(
        data, {
          where: {
            id
          }
        }, {
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
const updateDataPrivacy = async (id, data, res) => {
  try {
    return await db.sequelize.transaction((t) => {
      return DataPrivacy.update(
        data, {
          where: {
            id
          }
        }, {
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
const updateOrganization = async (id, data, res) => {
  try {
    return await db.sequelize.transaction((t) => {
      return Organization.update(
        data, {
          where: {
            id
          }
        }, {
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
const newAccessToken = async (memberId, req, res) => {
  try {
    return await db.sequelize.transaction((t) => {
      return MemberAccessToken.create({
        member_id: memberId,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }, {
        transaction: t
      })
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
  signup: async (req, res) => {
    const data = req.body
    data.password_created_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const newData = await createMember(data, res)
    await sendMail(newData.email, 'Verify E-mail', `Your verify E-mail click <a href="${process.env.BASE_URL}/verify-email/${newData.verify_token}" target="_blank" rel="Verify E-mail">${process.env.BASE_URL}/verify-email/${newData.verify_token}</a>`)
    return res.status(201).json({ token: newData.temp_token })
  },
  resendVerify: async (req, res, next) => {
    const body = req.body
    try {
      const data = await findByEmail(body.email, res)
      await sendMail(data.email, 'Resend Verify E-mail', `Your verify E-mail click <a href="${process.env.BASE_URL}/verify-email/${data.verify_token}" target="_blank" rel="Verify E-mail">${process.env.BASE_URL}/verify-email/${data.verify_token}</a>`)
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  verify: async (req, res, next) => {
    const body = req.body
    try {
      const data = await findByVerifyToken(body.token, res)
      const updateData = {
        verify_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      await updateMember(data.id, updateData, res)
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  forgotPassword: async (req, res, next) => {
    const body = req.body
    try {
      const data = await findByEmail(body.email, res)
      const passwordResetToken = randomstring.generate(64)
      const updateData = {
        password_reset_token: passwordResetToken,
        password_reset_expire_at: dayjs().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      }
      await updateMember(data.id, updateData, res)
      await sendMail(data.email, 'Reset Password', `Reset Password click <a href="${process.env.BASE_URL}/reset-password/${passwordResetToken}" target="_blank" rel="Reset Password">${process.env.BASE_URL}/reset-password/${passwordResetToken}</a>`)
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  checkPasswordToken: async (req, res, next) => {
    const body = req.body
    try {
      await findByResetPasswordToken(body.token, res)
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  resetPassword: async (req, res, next) => {
    const token = req.params.token
    const body = req.body
    try {
      const data = await findByResetPasswordToken(token, res)
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
      await updateMember(data.id, updateData, res)
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  login: async (req, res, next) => {
    if (req.user.verify_at) {
      try {
        const newRefreshToken = randomstring.generate(128)
        const updateData = {
          refresh_token: newRefreshToken,
          refresh_token_expire_at: dayjs().add(10, 'hours').format('YYYY-MM-DD HH:mm:ss')
        }
        await updateMember(req.user.id, updateData, res)

        const accessToken = await newAccessToken(req.user.id, req, res)
        return res.status(200).json({
          access_token: accessToken.access_token,
          refresh_token: newRefreshToken
        })
      } catch (e) {
        next(e)
      }
    } else {
      return res.status(403).json({
        message: 'Forbidden, this email has not been verified.'
      })
    }
  },
  oauth: (req, res) => {
    const key = req.params.key
    const data = new URLSearchParams()
    data.append('response_type', 'code')
    data.append('client_id', process.env[`${key.toUpperCase()}_CLIENT_ID`])
    data.append('redirect_uri', `${process.env.BASE_URL}/auth?authclient=${key}`)
    data.append('scope', process.env[`${key.toUpperCase()}_SCOPE`])
    data.append('state', process.env.OAUTH_STATE)
    return res.redirect(`${process.env[`${key.toUpperCase()}_OAUTH_URL`]}?${data.toString()}`)
  },
  callback: async (req, res) => {
    const key = req.params.key
    const code = req.query.code
    const state = req.query.state
    if (code && state) {
      if (state === process.env.OAUTH_STATE) {
        const data = new URLSearchParams()
        data.append('code', code)
        data.append('redirect_uri', `${process.env.BASE_URL}/auth?authclient=${key}`)
        data.append('client_id', process.env[`${key.toUpperCase()}_CLIENT_ID`])
        data.append('client_secret', process.env[`${key.toUpperCase()}_CLIENT_SECRET`])
        data.append('grant_type', 'authorization_code')

        try {
          const oauthAccessToken = await axios.post(process.env[`${key.toUpperCase()}_GET_ACCESS_TOKEN_URL`], data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })

          const userInfo = await axios.get(process.env[`${key.toUpperCase()}_GET_USER_INFO_URL`], {
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${oauthAccessToken.data.access_token}`
            }
          })

          const newRefreshToken = randomstring.generate(128)
          const updateData = {
            refresh_token: newRefreshToken,
            refresh_token_expire_at: dayjs().add(10, 'hours').format('YYYY-MM-DD HH:mm:ss')
          }

          let member = await Member.findOne({
            where: {
              email: userInfo.data.email
            }
          })
          if (!member) {
            const splitName = userInfo.data.name.split(' ')
            const createNewMember = {
              email: userInfo.data.email,
              password: randomstring.generate(64),
              verify_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              member_type: 'researcher',
              Researcher: {
                firstname: splitName[0],
                lastname: splitName.length > 1 ? splitName[1] : ''
              }
            }
            createNewMember[`${key}_id`] = userInfo.data.id
            createNewMember.avatar = key === 'facebook' ? userInfo.data.picture.data.url : userInfo.data.picture
            member = await createMember(createNewMember, res)
          } else {
            if (!member.verify_at) {
              updateData.verify_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
            if (!member[`${key}_id`]) {
              updateData[`${key}_id`] = userInfo.data.id
            }
            if (!member.avatar) {
              updateData.avatar = key === 'facebook' ? userInfo.data.picture.data.url : userInfo.data.picture
            }
          }

          await updateMember(member.id, updateData, res)

          const accessToken = await newAccessToken(member.id, req, res)
          return res.status(200).json({
            access_token: accessToken.access_token,
            refresh_token: newRefreshToken
          })
        } catch (e) {
          return res.status(401).json({
            message: 'Unauthorized' + e
          })
        }
      }
    }
    return res.status(400).json({
      message: 'Bad request'
    })
  },
  token: async (req, res, next) => {
    const refreshToken = req.body.refresh_token
    if (refreshToken) {
      try {
        const refresh = await Member.findOne({
          where: {
            refresh_token: refreshToken,
            refresh_token_expire_at: {
              [Op.gte]: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
          }
        })
        if (refresh) {
          const accessToken = await newAccessToken(refresh.id, req, res)
          return res.status(200).json({
            access_token: accessToken.access_token
          })
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
      user: req.user
    })
  },
  updateProfile: async (req, res, next) => {
    const data = req.body
    try {
      await updateMember(req.user.id, data, res)
    } catch (e) {
      next(e)
    }
    return res.status(204).send()
  },
  updateResearcherProfile: async (req, res, next) => {
    const data = req.body
    try {
      await updateResearcher(req.user.Researcher.id, data, res)
    } catch (e) {
      next(e)
    }
    return res.status(204).send()
  },
  updateDataPrivacyProfile: async (req, res, next) => {
    const data = req.body
    try {
      await updateDataPrivacy(req.user.DataPrivacy.id, data, res)
    } catch (e) {
      next(e)
    }
    return res.status(204).send()
  },
  updateOrganizationProfile: async (req, res, next) => {
    const data = req.body
    try {
      await updateOrganization(req.user.Organization.id, data, res)
    } catch (e) {
      next(e)
    }
    return res.status(204).send()
  },
  updatePassword: async (req, res, next) => {
    const body = req.body
    try {
      const data = await findByEmail(req.user.email, res)
      if (!data.password_created_at || (!!data.password_created_at && data.validPassword(body.old_password))) {
        const salt = bcryptjs.genSaltSync(10)
        const updateData = {
          salt,
          password: bcryptjs.hashSync(body.password, salt)
        }
        if (!data.password_created_at) {
          updateData.password_created_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        await updateMember(data.id, updateData, res)
        return res.status(204).send()
      }
      return res.status(401).json({
        message: 'Unauthorized'
      })
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  updateAvatar: async (req, res, next) => {
    if (req.file) {
      const { filename } = req.file
      const newFilename = filename.replace(/\.[^/.]+$/, '')
      const newPath = path.join(req.file.destination, `${newFilename}.webp`)
      await sharp(req.file.path).resize(200).webp().toFile(newPath)
      fs.unlinkSync(req.file.path)
      try {
        if (req.user.avatar) {
          const path = `static${req.user.avatar}`
          if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
              if (err) {
                console.error(err)
              }
            })
          }
        }
        const updateData = { avatar: newPath.replace('static', '') }
        await updateMember(req.user.id, updateData, res)
        return res.status(204).send()
      } catch (e) {
        if (req.file) {
          if (fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
              if (err) {
                console.error(err)
              }
            })
          }
          if (fs.existsSync(newPath)) {
            fs.unlink(newPath, (err) => {
              if (err) {
                console.error(err)
              }
            })
          }
        }
        e.message = 'Cannot store data from database.'
        next(e)
      }
    }
    return res.status(400).json({
      message: 'Bad request'
    })
  },
  addCV: async (req, res, next) => {
    if (req.file) {
      const body = req.body
      const { filename } = req.file
      const newPath = path.join(req.file.destination, filename)
      try {
        const member = await findByTempToken(body.token, res, [Researcher])
        const updateResearcherData = { cv: newPath.replace('static', '') }
        await updateResearcher(member.Researcher.id, updateResearcherData, res)
        const updateMemberData = {
          temp_token: null
        }
        await updateMember(member.id, updateMemberData, res)
        return res.status(204).send()
      } catch (e) {
        if (req.file) {
          if (fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
              if (err) {
                console.error(err)
              }
            })
          }
        }
        e.message = 'Cannot store data from database.'
        next(e)
      }
    }
    return res.status(400).json({
      message: 'Bad request'
    })
  },
  removeTempToken: async (req, res, next) => {
    const body = req.body
    const member = await findByTempToken(body.token, res)
    await updateMember(member.id, {
      temp_token: null
    }, res)
    return res.status(204).send()
  },
  updateCV: async (req, res, next) => {
    if (req.file) {
      const { filename } = req.file
      const newPath = path.join(req.file.destination, filename)
      try {
        if (req.user.Researcher.cv) {
          const path = `static${req.user.Researcher.cv}`
          if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
              if (err) {
                console.error(err)
              }
            })
          }
        }
        const updateData = { cv: newPath.replace('static', '') }
        await updateResearcher(req.user.Researcher.id, updateData, res)
        return res.status(204).send()
      } catch (e) {
        if (req.file) {
          if (fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
              if (err) {
                console.error(err)
              }
            })
          }
        }
        e.message = 'Cannot store data from database.'
        next(e)
      }
    }
    return res.status(400).json({
      message: 'Bad request'
    })
  },
  logout: async (req, res, next) => {
    try {
      const updateData = {
        refresh_token: null,
        refresh_token_expire_at: null
      }
      await updateMember(req.user.id, updateData, res)
    } catch (e) {
      next(e)
    }
    return res.status(204).send()
  }
}
