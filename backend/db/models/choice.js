"use strict";
module.exports = (sequelize, DataTypes) => {
  const Choice = sequelize.define(
    "Choice",
    {
      description: DataTypes.STRING,
      followUpQuestionId: DataTypes.INTEGER
    },
    {}
  );
  Choice.associate = function(models) {
    // associations can be defined here
    Choice.belongsTo(models.Question, { foreignKey: "questionId" });
  };
  return Choice;
};
