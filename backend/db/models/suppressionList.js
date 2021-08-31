'use strict';
module.exports = (sequelize, DataTypes) => {
  const SuppressionList = sequelize.define('SuppressionList', {
    email: DataTypes.STRING,
    reason: DataTypes.JSON
  }, {});
  SuppressionList.associate = function(models) {
    // associations can be defined here
  };
  return SuppressionList;
};