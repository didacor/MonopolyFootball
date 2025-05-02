const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const PartidaUsuari = require("./PartidaUsuari");

const MovimentUsuari = sequelize.define("MovimentUsuari", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data_moviment: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    dau_resultat: { 
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    casella_anterior: { 
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    casella_actual: { 
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    volta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_partida_usuari: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PartidaUsuari,
            key: "id"
        }
    }
}, {
    tableName: "MovimentUsuari",
    timestamps: false
});

module.exports = MovimentUsuari;