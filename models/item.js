'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  item.init({
    userId: DataTypes.INTEGER,
    invoiceId: DataTypes.INTEGER,
    itemDescription: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    amount: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'item',
  });
  return item;
};