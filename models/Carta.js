const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Carta = sequelize.define("Carta", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcio: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    funcionalitat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    valor: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "Carta",
    timestamps: false
});

module.exports = Carta;