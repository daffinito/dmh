import Cache from "../services/CacheService";

class UserService {
  constructor(_db) {
    this.db = _db;
  }

  async checkPassword(email, password, includeAccounts) {
    const resp = await this.db.getUser({ email: email, includeAccounts: includeAccounts });
    if (!resp.success) {
      return resp;
    }
    const validPassword = resp.data.validPassword(password);
    if (!validPassword) {
      return {
        success: false,
        message: "Invalid password."
      };
    }
    const user = {
      id: resp.data.dataValues.id,
      email: resp.data.dataValues.email,
      name: resp.data.dataValues.name,
      type: resp.data.dataValues.type,
      pending: resp.data.dataValues.pending,
      token: resp.data.dataValues.token,
      tokenExpiration: resp.data.dataValues.tokenExpiration,
      newOwner: resp.data.dataValues.newOwner
    };
    let masterAccount = null;
    let subAccts = [];
    if (typeof resp.data.dataValues.MasterAccount !== "undefined" && resp.data.dataValues.MasterAccount !== null) {
      masterAccount = resp.data.dataValues.MasterAccount.dataValues;
    }
    if (typeof resp.data.dataValues.SubAccounts !== "undefined" && resp.data.dataValues.SubAccounts !== null) {
      for (let subAcct of resp.data.dataValues.SubAccounts) {
        subAccts.push(subAcct.dataValues);
      }
    }

    return {
      success: resp.success,
      message: resp.message,
      user: user,
      masterAccount: masterAccount,
      subAccounts: subAccts
    };
  }

  async getUserDataByEmail(email, includeAccounts) {
    const resp = await this.db.getUser({ email: email, includeAccounts: includeAccounts });
    if (!resp.success) {
      return resp;
    }
    const user = {
      id: resp.data.dataValues.id,
      email: resp.data.dataValues.email,
      name: resp.data.dataValues.name,
      type: resp.data.dataValues.type,
      pending: resp.data.dataValues.pending,
      token: resp.data.dataValues.token,
      tokenExpiration: resp.data.dataValues.tokenExpiration,
      newOwner: resp.data.dataValues.newOwner
    };
    let masterAccount = null;
    let subAccts = [];
    if (typeof resp.data.dataValues.MasterAccount !== "undefined" && resp.data.dataValues.MasterAccount !== null) {
      masterAccount = resp.data.dataValues.MasterAccount.dataValues;
    }
    if (typeof resp.data.dataValues.SubAccounts !== "undefined" && resp.data.dataValues.SubAccounts !== null) {
      for (let subAcct of resp.data.dataValues.SubAccounts) {
        subAccts.push(subAcct.dataValues);
      }
    }

    return {
      success: resp.success,
      message: resp.message,
      user: user,
      masterAccount: masterAccount,
      subAccounts: subAccts
    };
  }

  async getUserDataByToken(token) {
    const resp = await this.db.getUser({ token: token, includeAccounts: true });
    const now = new Date();
    if (!resp.success) {
      return resp;
    }

    const user = {
      id: resp.data.dataValues.id,
      email: resp.data.dataValues.email,
      name: resp.data.dataValues.name,
      type: resp.data.dataValues.type,
      pending: resp.data.dataValues.pending,
      token: resp.data.dataValues.token,
      tokenExpiration: resp.data.dataValues.tokenExpiration,
      newOwner: resp.data.dataValues.newOwner
    };

    // disabling token expiration for now
    /*if (user.tokenExpiration.getTime() < now.getTime()) {
      return {
        success: false,
        message: "Token expired!",
        user: null,
        masterAccount: null,
        subAccounts: null
      };
    }*/

    let masterAccount = null;
    let subAccts = [];
    if (typeof resp.data.dataValues.MasterAccount !== "undefined" && resp.data.dataValues.MasterAccount !== null) {
      masterAccount = resp.data.dataValues.MasterAccount.dataValues;
    }
    if (typeof resp.data.dataValues.SubAccounts !== "undefined" && resp.data.dataValues.SubAccounts !== null) {
      for (let subAcct of resp.data.dataValues.SubAccounts) {
        subAccts.push(subAcct.dataValues);
      }
    }

    return {
      success: resp.success,
      message: resp.message,
      user: user,
      masterAccount: masterAccount,
      subAccounts: subAccts
    };
  }

  async getPendingUsers() {
    const resp = await this.db.getPendingUsers();

    if (resp === null) {
      return resp;
    }

    let users = [];
    for (let user of resp) {
      users.push({
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        pending: user.pending,
        token: user.token,
        tokenExpiration: user.tokenExpiration,
        newOwner: user.newOwner
      });
    }
    return users;
  }

  async getPendingUsersByAccount(accountId, isMaster) {
    const resp = await this.db.getPendingUsersByAccount(accountId, isMaster);
    if (!resp.success) {
      return resp;
    }

    const usersFromDb = resp.data;
    let pendingUsers = [];
    for (let user of usersFromDb) {
      pendingUsers.push({
        id: user.dataValues.id,
        email: user.dataValues.email,
        name: user.dataValues.name
      });
    }

    return {
      success: true,
      message: resp.message,
      users: pendingUsers
    };
  }

  async getActiveUsersByAccount(accountId, isMaster) {
    const resp = await this.db.getActiveUsersByAccount(accountId, isMaster);
    if (!resp.success) {
      return resp;
    }

    const usersFromDb = resp.data;
    let activeUsers = [];
    for (let user of usersFromDb) {
      activeUsers.push({
        id: user.dataValues.id,
        email: user.dataValues.email,
        name: user.dataValues.name
      });
    }

    return {
      success: true,
      message: resp.message,
      users: activeUsers
    };
  }

  async createUser(email, name, isDispensary, newOwner) {
    const resp = await this.db.createUser(email, name, isDispensary, newOwner);
    return resp;
  }

  async changePassword(email, password) {
    const resp = await this.db.changePassword(email, password);
    return resp;
  }

  async updateSettings(oldEmail, newEmail, name, oldPassword, newPassword) {
    if (!oldPassword) {
      return {
        success: false,
        message: "Password not provided."
      };
    }
    const authenticated = await this.checkPassword(oldEmail, oldPassword, false);
    if (!authenticated.success) {
      return {
        success: false,
        message: "Incorrect password."
      };
    }
    let changeEmailResp;
    let email = oldEmail;
    if (!!newEmail && newEmail !== oldEmail) {
      changeEmailResp = await this.db.changeUserEmail(oldEmail, newEmail);
      if (!changeEmailResp.success) {
        return changeEmailResp;
      }
      email = newEmail;
    }

    let changePasswordResp;
    if (!!newPassword) {
      changePasswordResp = await this.db.changePassword(email, newPassword);
      if (!changePasswordResp.success) {
        return changePasswordResp;
      }
    }

    let changeNameResp;
    if (!!name) {
      changeNameResp = await this.db.changeUserName(email, name);
      if (!changeNameResp.success) {
        return changeNameResp;
      }
    }

    return { success: true, message: "Successfully updated all settings." };
  }

  async setPassword(email, password, token) {
    const resp = await this.db.changePassword(email, password, token);
    return resp;
  }

  async forgotPassword(email) {
    const resp = await this.db.forgotPassword(email);
    return resp;
  }

  async newUserSettings(settings) {
    //console.log(settings);
    const setPasswordResp = await this.db.changePassword(settings.email, settings.password, settings.token);
    if (!setPasswordResp.success) {
      return setPasswordResp;
    }

    const changeNameResp = await this.db.changeUserName(settings.email, settings.name);
    if (!changeNameResp.success) {
      return changeNameResp;
    }

    return { success: true, message: "Successfully set new user settings." };
  }

  async getUserDataById(id) {
    const resp = await this.db.getUser({ id: id, includeAccounts: false });
    if (!resp.success) {
      return resp;
    }
    const user = {
      id: resp.data.dataValues.id,
      email: resp.data.dataValues.email,
      name: resp.data.dataValues.name,
      type: resp.data.dataValues.type,
      pending: resp.data.dataValues.pending,
      token: resp.data.dataValues.token,
      tokenExpiration: resp.data.dataValues.tokenExpiration,
      newOwner: resp.data.dataValues.newOwner
    };

    return {
      success: resp.success,
      message: resp.message,
      user: user
    };
  }
}

export default UserService;
