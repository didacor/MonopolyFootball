const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Partida = require("./Partida");
const Carta = require("./Carta");
const Usuari = require("./Usuari");

const CartaUtilitzada = sequelize.define("CartaUtilitzada", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW 
    },
    id_partida: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: Partida,
            key: "id"
        }
    },
    id_carta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Carta,
            key: "id"
        }
    },
    id_usuari_afectat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuari,
            key: "id"
        }
    }
}, {
    tableName: "CartaUtilitzada",
    timestamps: false
});

module.exports = CartaUtilitzada;