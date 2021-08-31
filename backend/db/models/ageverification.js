'use strict';
module.exports = (sequelize, DataTypes) => {
  const AgeVerification = sequelize.define('AgeVerification', {
    isover21: DataTypes.BOOLEAN,
    zip: DataTypes.STRING,
    ip: DataTypes.STRING
  }, {});
  AgeVerification.associate = function(models) {
    // associations can be defined here
  };
  return AgeVerification;
};