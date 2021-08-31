"use strict";
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      question: DataTypes.STRING,
      finalQuestion: DataTypes.BOOLEAN
    },
    {}
  );
  Question.associate = function(models) {
    // associations can be defined here
    Question.hasMany(models.Choice, { foreignKey: "questionId" });
  };
  return Question;
};
