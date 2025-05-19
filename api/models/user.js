'use strict'
const {
  Model
} = require('sequelize')
const bcryptjs = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      this.hasMany(models.AccessToken, {
        foreignKey: 'user_id'
      })
      this.belongsTo(models.Country, {
        foreignKey: 'country_id'
      })
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    name: DataTypes.STRING,
    refresh_token: DataTypes.STRING,
    refresh_token_expire_at: DataTypes.DATE,
    password_reset_token: DataTypes.STRING,
    password_reset_expire_at: DataTypes.DATE,
    password_created_at: {
      type: DataTypes.DATE
    },
    role: {
      type: DataTypes.ENUM('admin', 'country_admin', 'secret'),
      defaultValue: 'admin'
    },
    country_id: DataTypes.INTEGER,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        const salt = bcryptjs.genSaltSync(10)
        user.salt = salt
        user.password = bcryptjs.hashSync(user.password, salt)
      }
    },
    sequelize,
    underscored: true,
    tableName: 'users',
    modelName: 'User'
  })
  User.inputSchema = {
    name: 'required',
    email: 'required',
    password: 'required'
  }
  User.prototype.validPassword = function (password) {
    return bcryptjs.compareSync(password, this.password)
  }
  User.prototype.validAuthToken = function (authToken) {
    return this.auth_token === authToken
  }
  return User
}
