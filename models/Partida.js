const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Partida = sequelize.define("Partida", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estat: { 
        type: DataTypes.ENUM,
        values: ['No Iniciada', 'Iniciada', 'Finalitzada'],
        allowNull: false
    },
    data_creacio: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW 
    },
    torn_actual: { 
        type: DataTypes.INTEGER, 
        allowNull: false
    }
}, {
    tableName: "Partida",
    timestamps: false
});

module.exports = Partida;