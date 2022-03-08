const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        productId: { type: DataTypes.INTEGER, allowNull: false },
        catalogId: { type: DataTypes.INTEGER, allowNull: false },
        sellerId: { type: DataTypes.INTEGER, allowNull: false }
    };

    return sequelize.define('Orders', attributes);
}