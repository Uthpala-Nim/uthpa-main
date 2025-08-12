const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gamestore', 'root', 'rootpass', {
  host: 'mysql',
  dialect: 'mysql'
});

const Order = sequelize.define('Order', {
  items: {
    type: Sequelize.JSON,
    allowNull: false
  },
  total: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = {
  sequelize,
  Order
};
