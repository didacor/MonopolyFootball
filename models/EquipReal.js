const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const EquipReal = sequelize.define("EquipReal", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
}, {
    tableName: "EquipReal",
    timestamps: false
});

module.exports = EquipReal;