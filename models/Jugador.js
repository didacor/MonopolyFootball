const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const EquipReal = require("./EquipReal");

const Jugador = sequelize.define("Jugador", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    cognom: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    posicio: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    valor: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    atac: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    defensa: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    id_equip: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EquipReal,
            key: "id"
        }
    }
}, {
    tableName: "Jugador",
    timestamps: false
});

module.exports = Jugador;
