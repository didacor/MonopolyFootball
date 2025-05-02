const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Partida = require("./Partida");
const EquipVirtual = require("./EquipVirtual");
const Jugador = require("./Jugador");

const JugadorFitxat = sequelize.define("JugadorFitxat", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    preu_fitxatge: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    id_partida: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Partida,
            key: "id"
        }
    },
    id_equip_virtual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EquipVirtual,
            key: "id" 
        }
    },
    id_jugador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Jugador,
            key: "id"
        }
    }
}, {
    tableName: "JugadorFitxat",
    timestamps: false
});

module.exports = JugadorFitxat;