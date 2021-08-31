"use strict";
module.exports = (sequelize, DataTypes) => {
  const Strain = sequelize.define(
    "Strain",
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      description: DataTypes.TEXT,
      imgSrc: DataTypes.STRING,
      choices: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    {}
  );
  Strain.associate = function(models) {
    // associations can be defined here
    Strain.belongsTo(models.SubAccount, { foreignKey: "subAccountId" });
  };
  return Strain;
};
