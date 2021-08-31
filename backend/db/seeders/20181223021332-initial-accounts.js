"use strict";
const bcrypt = require("bcrypt");

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 14);

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      "MasterAccounts",
      [
        {
          // id: 1,
          name: "Fake Dispensary Master",
          owner: "fakedispensary@dialmyhigh.com",
          dispensaryLimit: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id: 2,
          name: "Fake Dispensary Master 2",
          owner: "fakedispensary3@dialmyhigh.com",
          dispensaryLimit: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );

    queryInterface.bulkInsert(
      "SubAccounts",
      [
        {
          // id: 1,
          name: "Fake Dispensary #420",
          logo: "https://s3-us-west-2.amazonaws.com/dialmyhigh/images/account/default/default.png",
          charts: [
            "https://insights-embed.newrelic.com/embedded_widget/REMOVED",
            "https://insights-embed.newrelic.com/embedded_widget/REMOVED",
            "https://insights-embed.newrelic.com/embedded_widget/REMOVED"
          ],
          masterAccountId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );

    queryInterface.bulkInsert(
      "Users",
      [
        {
          // id: 1,
          email: "REMOVED@gmail.com",
          password: bcrypt.hashSync("REMOVED", 12),
          name: "David Affinito",
          pending: false,
          type: "ADMIN",
          token: "37da9b91-9278-48c3-bc21-5779e85557f0",
          tokenExpiration: tomorrow,
          newOwner: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          //  id: 2,
          email: "fakedispensary@dialmyhigh.com",
          password: bcrypt.hashSync("Four:Twenty", 12),
          name: ", Look Behind you",
          pending: false,
          type: "DISPENSARY",
          token: "3e11a971-fee4-42fa-93d8-d6268bb74a30",
          tokenExpiration: tomorrow,
          newOwner: false,
          masterAccountId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          //  id: 3,
          email: "fakedispensary2@dialmyhigh.com",
          password: bcrypt.hashSync("Four:Twenty", 12),
          name: "Sum(Person)",
          pending: true,
          type: "DISPENSARY",
          token: "3e81a971-fe74-427a-9378-d6278bb74a31",
          tokenExpiration: tomorrow,
          newOwner: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          //  id: 4,
          email: "fakedispensary3@dialmyhigh.com",
          password: bcrypt.hashSync("Four:Twenty", 12),
          name: "Divide(AndConquer)",
          pending: true,
          type: "DISPENSARY",
          token: "f541567d-18ca-44ba-b6fc-559acdbe3e92",
          tokenExpiration: tomorrow,
          newOwner: true,
          masterAccountId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );

    queryInterface.bulkInsert(
      "SubAccountUser",
      [
        {
          // id: 1,
          userId: 2,
          subAccountId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // id: 1,
          userId: 3,
          subAccountId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );

    return queryInterface.bulkInsert(
      "Dispensaries",
      [
        {
          //  id: 1,
          place_id: "ChIJQ-2n9UinlVQRtok7iWEbk7o",
          name: "Bloom Dispensary - Portland",
          address: "2637 NE Martin Luther King Jr Blvd, Portland, OR 97212, USA",
          zip: "97212",
          lat: 45.541476,
          lng: -122.661936,
          subAccountId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("MasterAccounts", null, {});
    queryInterface.bulkDelete("SubAccounts", null, {});
    queryInterface.bulkDelete("Users", null, {});
    queryInterface.bulkDelete("SubAccountUser", null, {});
    return queryInterface.bulkDelete("Dispensaries", null, {});
  }
};
