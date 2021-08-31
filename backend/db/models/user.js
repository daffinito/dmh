"use strict";
const bcrypt = require("bcrypt");
const saltRounds = 12;
const generateHash = user => {
  if (user === null) {
    throw new Error("No user found.");
  } else if (!user.changed("password")) return user.password;
  else {
    const hash = bcrypt.hashSync(user.password, saltRounds); // wanted this to be async but was getting promise errors, making sync for now
    return hash;
  }
};

const generateBulkHash = password => {
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      pending: DataTypes.BOOLEAN,
      type: DataTypes.ENUM("ADMIN", "DISPENSARY", "PATIENT"),
      token: DataTypes.UUID,
      tokenExpiration: DataTypes.DATE,
      newOwner: DataTypes.BOOLEAN
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.password = generateHash(user);
        },
        beforeUpdate: (user, options) => {
          user.password = generateHash(user);
        },
        beforeBulkUpdate: ({ attributes, where }) => {
          if (!!attributes.password) {
            attributes.password = generateBulkHash(attributes.password);
          }
        }
      }
    }
  );
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.SubAccount, { through: "SubAccountUser", foreignKey: "userId" });
    User.belongsTo(models.MasterAccount, { foreignKey: "masterAccountId" });
  };
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  return User;
};
