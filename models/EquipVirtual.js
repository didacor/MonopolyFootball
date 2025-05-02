const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Usuari = require("./Usuari");
const Partida = require("./Partida");

const EquipVirtual = sequelize.define("EquipVirtual", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    pressupost: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        defaultValue: 100000000 
    },
    id_usuari: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuari,
            key: "id"
        }
    },
    id_partida: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Partida,
            key: "id"
        }
    }
}, {
    tableName: "EquipVirtual",
    timestamps: false
});

module.exports = EquipVirtual;