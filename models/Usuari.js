const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Usuari = sequelize.define("Usuari", {
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
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    contrasenya: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    genere: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "Usuari",
    timestamps: false
});

module.exports = Usuari;
