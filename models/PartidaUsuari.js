const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Partida = require("./Partida");
const Usuari = require("./Usuari");

const PartidaUsuari = sequelize.define("PartidaUsuari", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    temps_ultim_torn: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    pressupost_actual: { 
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
    id_usuari: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuari,
            key: "id"
        }
    }
}, {
    tableName: "PartidaUsuari",
    timestamps: false
});

module.exports = PartidaUsuari;