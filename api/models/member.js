'use strict'
const randomstring = require('randomstring')
const {
  Model
} = require('sequelize')
const bcryptjs = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    static associate (models) {
      this.hasMany(models.MemberAccessToken, {
        foreignKey: 'member_id'
      })
      this.hasMany(models.Forum, {
        foreignKey: 'member_id'
      })
      this.hasMany(models.Comment, {
        foreignKey: 'member_id'
      })
      this.belongsTo(models.Researcher, {
        foreignKey: 'researcher_id'
      })
      this.belongsTo(models.Organization, {
        foreignKey: 'organization_id'
      })
      this.belongsTo(models.DataPrivacy, {
        foreignKey: 'data_privacy_id'
      })
    }
  }
  Member.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    lang: {
      type: DataTypes.ENUM('th', 'en', 'zh', 'lo'),
      defaultValue: 'en'
    },
    refresh_token: DataTypes.STRING,
    refresh_token_expire_at: DataTypes.DATE,
    member_type: {
      type: DataTypes.ENUM('researcher', 'organization')
    },
    researcher_id: DataTypes.INTEGER,
    organization_id: DataTypes.INTEGER,
    data_privacy_id: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    facebook_id: {
      type: DataTypes.STRING,
      unique: true
    },
    google_id: {
      type: DataTypes.STRING,
      unique: true
    },
    temp_token: DataTypes.STRING,
    verify_token: DataTypes.STRING,
    verify_at: DataTypes.DATE,
    password_reset_token: DataTypes.STRING,
    password_reset_expire_at: DataTypes.DATE,
    password_created_at: {
      type: DataTypes.DATE
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    hooks: {
      beforeCreate: (member, options) => {
        const salt = bcryptjs.genSaltSync(10)
        member.salt = salt
        member.password = bcryptjs.hashSync(member.password, salt)
        member.temp_token = randomstring.generate(128)
        member.verify_token = randomstring.generate(64)
      }
    },
    sequelize,
    underscored: true,
    tableName: 'members',
    modelName: 'Member'
  })
  Member.inputSchema = {
    email: 'required',
    member_type: 'required'
  }
  Member.prototype.validPassword = function (password) {
    return bcryptjs.compareSync(password, this.password)
  }
  Member.prototype.validAuthToken = function (authToken) {
    return this.auth_token === authToken
  }
  return Member
}
