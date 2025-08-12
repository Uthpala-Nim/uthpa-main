const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gamestore', 'root', 'rootpass', {
  host: 'mysql',
  dialect: 'mysql'
});

const Game = sequelize.define('Game', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING
  },
  released_at: {
    type: Sequelize.DATE
  },
  price: {
    type: Sequelize.DECIMAL(10, 2)
  }
});

module.exports = {
  sequelize,
  Game
};
