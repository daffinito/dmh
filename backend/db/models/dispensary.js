"use strict";
module.exports = (sequelize, DataTypes) => {
  const Dispensary = sequelize.define(
    "Dispensary",
    {
      place_id: DataTypes.STRING,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      zip: DataTypes.STRING,
      lat: DataTypes.DECIMAL,
      lng: DataTypes.DECIMAL
    },
    {}
  );
  Dispensary.associate = function(models) {
    // associations can be defined here
    Dispensary.belongsTo(models.SubAccount, { foreignKey: "subAccountId" });
  };
  return Dispensary;
};
