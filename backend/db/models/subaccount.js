"use strict";

module.exports = (sequelize, DataTypes) => {
  const SubAccount = sequelize.define(
    "SubAccount",
    {
      name: DataTypes.STRING,
      logo: DataTypes.STRING,
      charts: DataTypes.ARRAY(DataTypes.STRING)
    },
    {}
  );
  SubAccount.associate = function(models) {
    // associations can be defined here
    SubAccount.hasOne(models.Dispensary, { foreignKey: "subAccountId" });
    SubAccount.hasMany(models.Strain, { foreignKey: "subAccountId" });
    SubAccount.belongsTo(models.MasterAccount, { foreignKey: "masterAccountId" });
    SubAccount.belongsToMany(models.User, { through: "SubAccountUser", foreignKey: "subAccountId" });
  };

  return SubAccount;
};
