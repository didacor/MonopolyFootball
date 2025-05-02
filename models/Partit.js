const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const EquipVirtual = require("./EquipVirtual");

const Partit = sequelize.define("Partit", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_equip_local: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: EquipVirtual,
            key: "id"
        } 
    },
    id_equip_visitant: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: EquipVirtual,
            key: "id"
        }
    },
    punts_local: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        defaultValue: 0 
    },
    punts_visitant: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        defaultValue: 0 
    }
}, {
    tableName: "Partit",
    timestamps: false
});

module.exports = Partit;