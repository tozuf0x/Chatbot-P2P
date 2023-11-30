'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ErrorModel extends Model {
    static associate(models) {
      // define associations here
    }
  }
  ErrorModel.init(
    {
      code: DataTypes.INTEGER,
      errtext: DataTypes.STRING,
      recommendation: DataTypes.STRING,
      obj: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ErrorModel',
      tableName: 'errors', // Замените на имя вашей таблицы
      timestamps: false, // Если у вас нет полей created_at и updated_at
    }
  );
  ErrorModel.removeAttribute('id');
  return ErrorModel;
};
