const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        sellerId: { type: DataTypes.INTEGER, allowNull: false }
    };

    return sequelize.define('Catalogs', attributes);
}