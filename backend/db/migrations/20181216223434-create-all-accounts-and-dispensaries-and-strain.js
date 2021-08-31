"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("MasterAccounts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      owner: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dispensaryLimit: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable("SubAccounts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      logo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      charts: {
        allowNull: true,
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      masterAccountId: {
        type: Sequelize.INTEGER,
        references: {
          model: "MasterAccounts",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["ADMIN", "DISPENSARY", "PATIENT"]
      },
      pending: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      token: {
        type: Sequelize.UUID
      },
      tokenExpiration: {
        type: Sequelize.DATE
      },
      masterAccountId: {
        type: Sequelize.INTEGER,
        references: {
          model: "MasterAccounts",
          key: "id"
        }
      },
      newOwner: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable("SubAccountUser", {
      subAccountId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable("Dispensaries", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subAccountId: {
        type: Sequelize.INTEGER,
        references: {
          model: "SubAccounts",
          key: "id"
        }
      },
      place_id: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.DECIMAL
      },
      lng: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    return await queryInterface.createTable("Strains", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subAccountId: {
        type: Sequelize.INTEGER,
        references: {
          model: "SubAccounts",
          key: "id"
        }
      },
      name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      imgSrc: {
        type: Sequelize.STRING
      },
      choices: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Strains");
    await queryInterface.dropTable("Dispensaries");
    await queryInterface.dropTable("Users");
    await queryInterface.dropTable("SubAccounts");
    await queryInterface.dropTable("SubAccountUser");
    return await queryInterface.dropTable("MasterAccounts");
  }
};
