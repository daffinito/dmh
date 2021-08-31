"use strict";

module.exports = (sequelize, DataTypes) => {
  const MasterAccount = sequelize.define(
    "MasterAccount",
    {
      name: DataTypes.STRING,
      dispensaryLimit: DataTypes.INTEGER,
      owner: DataTypes.STRING
    },
    {}
  );
  MasterAccount.associate = function(models) {
    // associations can be defined here
    MasterAccount.hasMany(models.SubAccount, { foreignKey: "masterAccountId" });
    MasterAccount.hasMany(models.User, { foreignKey: "masterAccountId" });
  };
  return MasterAccount;
};
