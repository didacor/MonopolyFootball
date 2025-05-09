//Connexió a la base de dades
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("didacdaw", "didacdaw", "Girona4617", {
  host: "ellaboratori.cat",
  dialect: "mysql",
  port: 3306,
  logging: false
});

module.exports = sequelize;
