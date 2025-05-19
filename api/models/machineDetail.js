'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class MachineDetail extends Model {
    static associate (models) {
      this.belongsTo(models.Currency, {
        foreignKey: 'currency_id'
      })
      this.belongsTo(models.LabLocation, {
        foreignKey: 'lab_location_id'
      })
    }
  }
  MachineDetail.init({
    name: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    price: DataTypes.DOUBLE,
    currency_id: DataTypes.INTEGER,
    link: DataTypes.STRING,
    service_condition: DataTypes.DOUBLE,
    lab_location_id: DataTypes.INTEGER
  }, {
    sequelize,
    underscored: true,
    tableName: 'machine_details',
    modelName: 'MachineDetail'
  })
  return MachineDetail
}
