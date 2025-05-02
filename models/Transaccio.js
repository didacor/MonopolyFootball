const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Partida = require("./Partida");
const Usuari = require("./Usuari");

const Transaccio = sequelize.define("Transaccio", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    import: { 
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    tipus: {
        type: DataTypes.ENUM,
        values: ['Fitxatge', 'Venta', 'Altre'],
        allowNull: false
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
    id_usuari: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuari,
            key: "id"
        }
    }
}, {
    tableName: "Transaccio",
    timestamps: false
});

module.exports = Transaccio;