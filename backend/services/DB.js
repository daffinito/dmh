import models from "../db/models";
import Sequelize from "sequelize";
import UserService from "./UserService";
const bcrypt = require("bcrypt");
const uuidv1 = require("uuid/v1");
const sequelize = require("../db/models").sequelize;
const Op = Sequelize.Op;

class DB {
  constructor(_cache) {
    this.cache = _cache;
    this.defaultPassword = `REMOVED`;
  }

  async checkSuppressionList(email) {
    let resp;
    try {
      resp = await models.SuppressionList.findOne({ where: { email: email } });
    } catch (err) {
      console.log(err);
      return { email: email, reason: "There was a DB error, suppressing all emails." };
    }
    if (!resp) {
      return null;
    }

    return resp.dataValues;
  }

  async getSuppressionList() {
    let resp;
    try {
      resp = await models.SuppressionList.findAll();
    } catch (err) {
      console.log(err);
      return { success: false, message: "There was a DB error." };
    }
    if (!resp) {
      return { success: false, message: "There was no response from the DB." };
    }

    let list = [];
    for (let r of resp) {
      list.push(r.dataValues);
    }
    return {
      success: true,
      message: "Operation successful.",
      suppressionList: list
    };
  }

  async addToSuppressionList(email, reason) {
    let resp = [];
    try {
      resp = await models.SuppressionList.findOrCreate({
        where: { email: email },
        defaults: {
          reason: reason
        }
      });
    } catch (err) {
      console.log(err);
      return { success: false, message: `DB Error occurred while adding ${email} to the suppression list.` };
    }
    return { success: true, message: `Successfully added ${email} to the suppression list.` };
  }

  async deleteSuppression(id) {
    let deleteResp;

    try {
      deleteResp = await models.SuppressionList.destroy({
        where: {
          id: id
        },
        limit: 1
      });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "A database error occurred while deleting suppression."
      };
    }

    return {
      success: true,
      message: "Successfully deleted suppression."
    };
  }

  async deleteUser(id) {
    let deleteResp;

    try {
      deleteResp = await models.User.destroy({
        where: {
          id: id
        },
        limit: 1
      });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "A database error occurred while deleting user."
      };
    }

    return {
      success: true,
      message: "Successfully deleted user."
    };
  }

  addAgeVerification(ip, zip, isOver21) {
    return models.AgeVerification.build({
      ip: ip,
      isover21: isOver21,
      zip: zip
    })
      .save()
      .then(data => {
        // console.log("Successfully added age verification data to the db: ")
        // console.log(data)
        return true;
      })
      .catch(error => {
        console.log("There was an error adding the age verification data to the db: ");
        console.log(error);
        return false;
      });
  }

  getQuestion(questionId) {
    return models.Question.findOne({
      where: {
        id: questionId
      }
    }).then(resp => {
      return resp.dataValues;
    });
  }

  getChoices(questionId) {
    return models.Choice.findAll({
      where: {
        questionId: questionId
      }
    }).then(resp => {
      let choices = [];
      for (let choice of resp) {
        choices.push(choice.dataValues);
      }
      return choices;
    });
  }

  async getChoiceById(id) {
    let resp,
      cacheKey = `choice_${id}`;
    try {
      resp = await this.cache.get(
        cacheKey,
        async () =>
          await models.Choice.findOne({
            where: {
              id: id
            }
          })
      );
    } catch (err) {
      return {
        success: false,
        message: err
      };
    }

    return {
      success: true,
      message: "Operation successful",
      choice: resp.dataValues
    };
  }

  async getStrains(selections, subAccountId) {
    let resp,
      useSubAccount = typeof subAccountId !== "undefined";
    try {
      resp = await models.Strain.findAll({
        where: {
          choices: {
            [Op.contains]: selections
          },
          subAccountId: useSubAccount ? subAccountId : null
        }
      });
    } catch (err) {
      console.log(err);
      return null;
    }
    if (resp.length === 0 && useSubAccount) {
      // we used subaccount but got no resp, now search without subaccount
      try {
        resp = await models.Strain.findAll({
          where: {
            choices: {
              [Op.contains]: selections
            },
            subAccountId: null
          }
        });
      } catch (err) {
        console.log(err);
        return null;
      }
    }
    let strains = [];
    for (let strain of resp) {
      strains.push(strain.dataValues);
    }
    return strains;
  }

  async getCustomStrains(accountId) {
    let resp,
      strains = [];
    try {
      resp = await models.Strain.findAll({
        where: {
          subAccountId: accountId
        }
      });
    } catch (err) {
      return {
        success: false,
        message: err
      };
    }
    for (let strainResp of resp) {
      let choices = [];
      let strain = strainResp.dataValues;
      for (let choiceId of strain.choices) {
        const choice = await this.getChoiceById(choiceId);
        choices.push(choice.choice);
      }
      strain.choices = choices;
      strains.push(strain);
    }
    return {
      success: true,
      message: "Successfully found custom strains.",
      strains: strains
    };
  }

  async getDispensaryByZip(zip) {
    let resp;
    try {
      resp = await models.Dispensary.findOne({
        where: {
          zip: zip.toString()
        },
        include: [
          {
            model: models.SubAccount
          }
        ]
      });
    } catch (err) {
      console.log(err);
      return null;
    }
    if (!resp) {
      return null;
    }
    const dispResp = resp.dataValues;
    if (dispResp.SubAccount) {
      dispResp.logo = dispResp.SubAccount.logo;
      delete dispResp.SubAccount;
    }

    return dispResp;
  }

  async getDispensaryByAccountId(accountId) {
    let dispensary;
    try {
      dispensary = await models.Dispensary.findOne({
        where: {
          subAccountId: accountId
        }
      });
    } catch (err) {
      return {
        success: false,
        message: err
      };
    }

    if (dispensary === null) {
      return {
        success: false,
        message: `No dispensary found for account ${accountId}`
      };
    }

    return {
      success: true,
      message: `Successfully found dispensary.`,
      dispensary: dispensary
    };
  }

  getRandomDispensary() {
    return models.Dispensary.findOne({
      order: sequelize.random()
    }).then(resp => {
      return resp === null ? resp : resp.dataValues;
    });
  }

  async getUser(by) {
    let user = null;

    // by email
    if (typeof by.email !== "undefined") {
      // don't include accounts
      if (typeof by.includeAccounts === "undefined" || !by.includeAccounts) {
        try {
          user = await models.User.findOne({
            where: {
              email: by.email
            }
          });
        } catch (err) {
          return {
            success: false,
            message: err,
            data: null
          };
        }
        if (user === null) {
          return {
            success: false,
            message: `No user found with email ${by.email}`,
            data: null
          };
        }
        return {
          success: true,
          message: `Successfully found user ${by.email}`,
          data: user
        }; // include accounts
      } else if (by.includeAccounts) {
        try {
          user = await models.User.findOne({
            where: {
              email: by.email
            },
            include: [
              {
                model: models.MasterAccount,
                include: [
                  {
                    model: models.SubAccount,
                    include: [
                      {
                        model: models.Dispensary
                      }
                    ]
                  }
                ]
              },
              {
                model: models.SubAccount,
                include: [
                  {
                    model: models.Dispensary
                  }
                ]
              }
            ]
          });
        } catch (err) {
          return {
            success: false,
            message: err,
            data: null
          };
        }
        if (user === null) {
          return {
            success: false,
            message: `No user found with email ${by.email}`,
            data: null
          };
        }

        return {
          success: true,
          message: `Successfully found user ${by.email}`,
          data: user
        };
      } // by token
    } else if (typeof by.token !== "undefined") {
      if (typeof by.includeAccounts === "undefined" || !by.includeAccounts) {
        try {
          user = await models.User.findOne({
            where: {
              token: by.token,
              pending: true
            }
          });
        } catch (err) {
          return {
            success: false,
            message: err,
            data: null
          };
        }
        if (user === null) {
          return {
            success: false,
            message: `No user found with token ${by.token}`,
            data: null
          };
        }
        return {
          success: true,
          message: `Successfully found user ${by.token}`,
          data: user
        };
      } else if (by.includeAccounts) {
        try {
          user = await models.User.findOne({
            where: {
              token: by.token,
              pending: true
            },
            include: [
              {
                model: models.MasterAccount,
                include: [
                  {
                    model: models.SubAccount,
                    include: [
                      {
                        model: models.Dispensary
                      }
                    ]
                  }
                ]
              },
              {
                model: models.SubAccount,
                include: [
                  {
                    model: models.Dispensary
                  }
                ]
              }
            ]
          });
        } catch (err) {
          return {
            success: false,
            message: err,
            data: null
          };
        }
        if (user === null) {
          return {
            success: false,
            message: `No user found with token ${by.token}`,
            data: null
          };
        }

        return {
          success: true,
          message: `Successfully found user ${by.token}`,
          data: user
        };
      }
    } else if (typeof by.id !== "undefined") {
      if (typeof by.includeAccounts === "undefined" || !by.includeAccounts) {
        try {
          user = await models.User.findOne({
            where: {
              id: by.id
            }
          });
        } catch (err) {
          return {
            success: false,
            message: err,
            data: null
          };
        }
        if (user === null) {
          return {
            success: false,
            message: `No user found with id ${by.id}`,
            data: null
          };
        }
        return {
          success: true,
          message: `Successfully found user ${by.id}`,
          data: user
        };
      } else if (by.includeAccounts) {
        try {
          user = await models.User.findOne({
            where: {
              id: by.id
            },
            include: [
              {
                model: models.MasterAccount,
                include: [
                  {
                    model: models.SubAccount,
                    include: [
                      {
                        model: models.Dispensary
                      }
                    ]
                  }
                ]
              },
              {
                model: models.SubAccount,
                include: [
                  {
                    model: models.Dispensary
                  }
                ]
              }
            ]
          });
        } catch (err) {
          return {
            success: false,
            message: err,
            data: null
          };
        }
        if (user === null) {
          return {
            success: false,
            message: `No user found with id ${by.id}`,
            data: null
          };
        }

        return {
          success: true,
          message: `Successfully found user ${by.id}`,
          data: user
        };
      }
    }
    // if it got here, { by } probably wasn't specified..
    return {
      success: false,
      message: `Something went wrong!`,
      data: null
    };
  }

  getPendingUsers() {
    return models.User.findAll({
      where: {
        pending: true
      }
    }).then(resp => {
      if (resp === null) {
        return resp;
      }
      let users = [];
      for (let user of resp) {
        users.push(user.dataValues);
      }
      return users;
    });
  }

  async getPendingUsersByAccount(id, isMaster) {
    let users;
    if (isMaster) {
      try {
        users = await models.User.findAll({
          where: {
            masterAccountId: id,
            pending: true
          }
        });
      } catch (err) {
        return {
          success: false,
          message: `An error occurred while searching for pending users for master ${id}: ${err}`
        };
      }
    } else {
      let account;
      try {
        account = await models.SubAccount.findOne({
          where: {
            id: id
          },
          include: [
            {
              model: models.User,
              where: {
                pending: true
              }
            }
          ]
        });
      } catch (err) {
        return {
          success: false,
          message: `An error occurred while searching for pending users sub for ${id}: ${err}`
        };
      }

      users = account === null ? [] : account.dataValues.Users;
    }

    return {
      success: true,
      message: `Successfully found pending users for account ${id}`,
      data: users
    };
  }

  async getActiveUsersByAccount(id, isMaster) {
    let users;
    if (isMaster) {
      try {
        users = await models.User.findAll({
          where: {
            masterAccountId: id,
            pending: false
          }
        });
      } catch (err) {
        return {
          success: false,
          message: `An error occurred while searching for active users for master ${id}: ${err}`
        };
      }
    } else {
      let account;
      try {
        account = await models.SubAccount.findOne({
          where: {
            id: id
          },
          include: [
            {
              model: models.User,
              where: {
                pending: false
              }
            }
          ]
        });
      } catch (err) {
        return {
          success: false,
          message: `An error occurred while searching for active users sub for ${id}: ${err}`
        };
      }
      users = account ? account.dataValues.Users : null;
    }

    return {
      success: true,
      message: `Successfully found active users for account ${id}`,
      data: users
    };
  }

  getMasterAccounts() {
    return models.MasterAccount.findAll({
      include: [
        {
          model: models.SubAccount,
          include: [
            {
              model: models.Dispensary
            }
          ]
        }
      ]
    }).then(resp => {
      if (resp === null) {
        return resp;
      }
      let accounts = [];
      for (let acct of resp) {
        accounts.push(acct.dataValues);
      }
      return accounts;
    });
  }

  async getMasterAccountById(id) {
    let resp;
    try {
      resp = await models.MasterAccount.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: models.SubAccount,
            include: [
              {
                model: models.Dispensary
              }
            ]
          }
        ]
      });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "An error occurred while accessing the DB."
      };
    }

    if (!resp) {
      return {
        success: false,
        message: `No account found by with id ${id}`
      };
    }
    return {
      success: true,
      message: "Success",
      account: resp.dataValues
    };
  }

  async getDispensaryAccountById(id) {
    let resp;
    try {
      resp = await models.SubAccount.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: models.Dispensary
          }
        ]
      });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "An error occurred while accessing the DB."
      };
    }

    if (!resp) {
      return {
        success: false,
        message: `No account found by with id ${id}`
      };
    }
    return {
      success: true,
      message: "Success",
      account: resp.dataValues
    };
  }

  async createUser(email, name, isDispensary, newOwner) {
    let type = "DISPENSARY";
    if (typeof isDispensary === "undefined" || !isDispensary) {
      type = "PATIENT";
    }
    if (typeof newOwner !== "boolean") {
      newOwner = false;
    }

    const twoweeks = new Date();
    twoweeks.setDate(twoweeks.getDate() + 14);
    const uuid = uuidv1();
    let resp = [];
    try {
      resp = await models.User.findOrCreate({
        where: {
          email: email
        },
        defaults: {
          password: this.defaultPassword,
          pending: true,
          name: name,
          type: type,
          token: uuid,
          tokenExpiration: twoweeks,
          newOwner: newOwner
        }
      });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while creating user with email ${email}`
      };
    }
    const user = resp[0];
    const created = resp[1];
    if (created) {
      return {
        success: true,
        message: `User with email ${email} created successfully.`,
        user: user
      };
    }
    if (!created && user === null) {
      return {
        success: false,
        message: `An unknown error occurred while creating user with email ${email}`
      };
    }
    return {
      success: false,
      message: `User with email ${email} already exists.`,
      user: user
    };
  }

  async createAccount(name, email, type) {
    if (typeof type === "undefined") {
      type = "MASTER";
    }
    let masterAccount, user;

    try {
      masterAccount = await models.MasterAccount.build({
        name: name,
        dispensaryLimit: 3,
        owner: email
      }).save();
    } catch (err) {
      return {
        success: false,
        message: err,
        masterAccount: null
      };
    }

    try {
      user = await models.User.findOne({
        where: {
          email: email
        }
      });
    } catch (err) {
      return {
        success: false,
        message: err,
        masterAccount: null
      };
    }

    if (user === null || typeof user === "undefined") {
      return {
        success: false,
        message: `An error occurred while adding user ${email} to Master Account.`,
        masterAccount: null
      };
    }

    const retVal = await masterAccount.addUser(user);
    return {
      success: true,
      message: "Successfully created Master Account.",
      masterAccount: retVal.dataValues
    };
  }

  async createDispensaryAccount(masterAccountId, name, email) {
    let account, dispensary, user;

    try {
      account = await models.SubAccount.build({
        name: name,
        logo: "https://s3-us-west-2.amazonaws.com/dialmyhigh/images/account/default/default.png",
        charts: ["", "", ""],
        masterAccountId: masterAccountId
      }).save();
    } catch (err) {
      return {
        success: false,
        message: err
      };
    }

    try {
      dispensary = await models.Dispensary.build({
        place_id: "",
        name: "",
        address: "",
        zip: "",
        lat: null,
        lng: null,
        subAccountId: account.dataValues.id
      }).save();
    } catch (err) {
      return {
        success: false,
        message: err
      };
    }

    try {
      user = await models.User.findOne({
        where: {
          email: email
        }
      });
    } catch (err) {
      return {
        success: false,
        message: err
      };
    }

    if (user === null || typeof user === "undefined") {
      return {
        success: false,
        message: `An error occurred while adding user ${email} to Dispensary Account.`
      };
    }

    const retVal = await account.addUser(user);
    return {
      success: true,
      message: "Successfully created Dispensary Account.",
      account: account.dataValues
    };
  }

  async updateDispensaryCharts(accountId, chartLinks) {
    let resp;

    try {
      resp = await models.SubAccount.update({ charts: chartLinks }, { where: { id: accountId } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while updating chart links for account ${accountId}`
      };
    }

    return {
      success: true,
      message: `Successfully updated chart links for account ${accountId}`
    };
  }

  async deleteDispensaryAccount(accountId) {
    let deleteDispResp, deleteAcctResp;

    try {
      deleteDispResp = await models.Dispensary.destroy({
        where: {
          subAccountId: accountId
        },
        limit: 1
      });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "A database error occurred while deleting the dispensary."
      };
    }

    try {
      deleteAcctResp = await models.SubAccount.destroy({
        where: {
          id: accountId
        },
        limit: 1
      });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "A database error occurred while deleting the subaccount."
      };
    }

    return {
      success: true,
      message: "Successfully deleted Dispensary Account."
    };
  }

  async forgotPassword(email) {
    let resp;
    const twoweeks = new Date();
    twoweeks.setDate(twoweeks.getDate() + 14);
    const uuid = uuidv1();
    try {
      resp = await models.User.update(
        { password: this.defaultPassword, pending: true, token: uuid, tokenExpiration: twoweeks },
        { where: { email: email } }
      );
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while creating token for ${email}`
      };
    }
    return {
      success: true,
      message: `Successfully created token for ${email}`,
      token: uuid
    };
  }

  async changePassword(email, password, token) {
    let resp;
    if (typeof token === "undefined") {
      try {
        resp = await models.User.update({ password: password }, { where: { email: email } });
      } catch (err) {
        console.log(err);
        return {
          success: false,
          message: `An unknown error occurred while updating password for ${email}`
        };
      }
      return {
        success: true,
        message: `Successfully changed password for ${email}`
      };
    }

    // if token was provided, they are a pending user confirming their account.
    try {
      resp = await models.User.update({ password: password, pending: false }, { where: { email: email, token: token } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while setting password for ${email}`
      };
    }
    return {
      success: true,
      message: `Successfully set password for ${email}`
    };
  }

  async changeUserEmail(oldEmail, newEmail) {
    let getResp;
    try {
      getResp = await models.User.findOne({ where: { email: newEmail } });
    } catch (getErr) {
      return {
        success: false,
        message: `An unknown error occurred while updating email for ${oldEmail}`
      };
    }
    if (getResp !== null) {
      return {
        success: false,
        message: `A user with email ${newEmail} already exists.`
      };
    }

    let resp;
    try {
      resp = await models.User.update({ email: newEmail }, { where: { email: oldEmail } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while updating email for ${oldEmail}`
      };
    }
    return {
      success: true,
      message: `Successfully changed email from ${oldEmail} to  ${newEmail}`
    };
  }

  async changeUserName(email, name) {
    let resp;
    try {
      resp = await models.User.update({ name: name }, { where: { email: email } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while updating name for ${email}`
      };
    }
    return {
      success: true,
      message: `Successfully changed user name for ${email}`
    };
  }

  async updateDispensaryLogo(logo, accountId) {
    let resp;

    try {
      resp = await models.SubAccount.update({ logo: logo }, { where: { id: accountId } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while updating dispensary logo accountid: ${accountId}`
      };
    }
    return {
      success: true,
      message: `Successfully updated dispensary logo accountid: ${accountId}`
    };
  }

  async updateMasterName(accountId, name) {
    let resp;

    try {
      resp = await models.MasterAccount.update({ name: name }, { where: { id: accountId } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while updating master name accountid: ${accountId}`
      };
    }
    return {
      success: true,
      message: `Successfully updated master name accountid: ${accountId}`
    };
  }

  async addUserToMaster(accountId, email) {
    const createUserResp = await this.createUser(email, email, true); // default name is email address

    if (typeof createUserResp.user === "undefined") {
      return { success: false, message: `Error adding ${email} to master ${accountId}` };
    }

    const isNewUser = createUserResp.success;
    const { user } = createUserResp;

    let account;
    try {
      account = await models.MasterAccount.findOne({ where: { id: accountId } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while adding ${email} to master ${accountId}`
      };
    }

    const retVal = await account.addUser(user);
    return {
      success: true,
      message: `Successfully added ${email} to master ${accountId}`,
      user: user,
      isNewUser: isNewUser
    };
  }

  async addUserToDispensary(accountId, email) {
    const createUserResp = await this.createUser(email, email, true); // default name is email address

    if (typeof createUserResp.user === "undefined") {
      return { success: false, message: `Error adding ${email} to dispensary ${accountId}` };
    }

    const isNewUser = createUserResp.success;
    const { user } = createUserResp;

    let account;
    try {
      account = await models.SubAccount.findOne({ where: { id: accountId } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while adding ${email} to dispensary ${accountId}`
      };
    }

    const retVal = await account.addUser(user);
    return {
      success: true,
      message: `Successfully added ${email} to dispensary ${accountId}`,
      user: user,
      isNewUser: isNewUser
    };
  }

  async deleteUserFromMaster(accountId, email) {
    let account, user;
    try {
      account = await models.MasterAccount.findOne({ where: { id: accountId } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while removing ${email} from master ${accountId}`
      };
    }

    try {
      user = await models.User.findOne({
        where: {
          email: email
        }
      });
    } catch (err) {
      return {
        success: false,
        message: err
      };
    }

    const retVal = await account.removeUser(user);
    return {
      success: true,
      message: `Successfully removed ${email} from master ${accountId}`
    };
  }

  async deleteUserFromDispensary(accountId, email) {
    let account, user;
    try {
      account = await models.SubAccount.findOne({ where: { id: accountId } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while removing ${email} from dispensary ${accountId}`
      };
    }

    try {
      user = await models.User.findOne({
        where: {
          email: email
        }
      });
    } catch (err) {
      return {
        success: false,
        message: err
      };
    }

    const retVal = await account.removeUser(user);
    return {
      success: true,
      message: `Successfully removed ${email} from dispensary ${accountId}`
    };
  }

  async updateDispensaryAddress(accountId, dispensaryInfo) {
    let resp;
    try {
      resp = await models.Dispensary.update(
        {
          place_id: dispensaryInfo.place_id,
          name: dispensaryInfo.name,
          address: dispensaryInfo.address,
          zip: dispensaryInfo.zip,
          lng: dispensaryInfo.lng,
          lat: dispensaryInfo.lat
        },
        { where: { subAccountId: accountId } }
      );
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `An unknown error occurred while updating dispensary address accountid: ${accountId}`
      };
    }
    console.log(resp);
    return {
      success: true,
      message: `Successfully updated dispensary address accountid: ${accountId}`
    };
  }

  async addCustomStrain(accountId, strainInfo) {
    let strain;

    try {
      strain = await models.Strain.build({
        name: strainInfo.name,
        type: strainInfo.type,
        description: strainInfo.description,
        imgSrc: strainInfo.imgSrc,
        choices: strainInfo.choices,
        subAccountId: accountId
      }).save();
    } catch (err) {
      return {
        success: false,
        message: err
      };
    }
    return {
      success: true,
      message: "Successfully created custom strain."
    };
  }

  async deleteCustomStrain(accountId, strainId) {
    let deleteStrainResp;

    try {
      deleteStrainResp = await models.Strain.destroy({
        where: {
          subAccountId: accountId,
          id: strainId
        },
        limit: 1
      });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "A database error occurred while deleting the custom strain."
      };
    }

    return {
      success: true,
      message: "Successfully deleted the custom strain."
    };
  }
}
export default DB;
