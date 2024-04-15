'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  invoice.init({
    userId: DataTypes.STRING,
    brandLogo: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    customerName: DataTypes.STRING,
    billingAddress: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    customerEmail: DataTypes.STRING,
    invoiceTitle: DataTypes.STRING,
    paymentCurrency: DataTypes.STRING,
    itemDescription: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.STRING,
    amount: DataTypes.STRING,
    additionalInfo: DataTypes.TEXT,
    accountName: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    bankName: DataTypes.STRING,
    issueDate: DataTypes.DATE,
    dueDate: DataTypes.DATE,
    discount: DataTypes.STRING,
    tax: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('paid', 'unpaid', 'draft', 'overdue'),
      defaultValue: "unpaid"
    }
  }, {
    sequelize,
    modelName: 'invoice',
    paranoid: true
  });
  return invoice;
};