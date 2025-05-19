'use strict'
const randomstring = require('randomstring')
const {
  Model
} = require('sequelize')
const dayjs = require('dayjs')

module.exports = (sequelize, DataTypes) => {
  class MemberAccessToken extends Model {
    static associate (models) {
      this.belongsTo(models.Member, {
        foreignKey: 'member_id'
      })
    }
  };
  MemberAccessToken.init({
    member_id: DataTypes.INTEGER,
    access_token: DataTypes.STRING,
    ip: DataTypes.STRING,
    expire_at: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate: (memberAccessToken, options) => {
        memberAccessToken.access_token = randomstring.generate(128)
        memberAccessToken.expire_at = dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
      }
    },
    sequelize,
    underscored: true,
    tableName: 'member_access_tokens',
    modelName: 'MemberAccessToken'
  })
  return MemberAccessToken
}
