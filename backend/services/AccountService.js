class AccountService {
  constructor(_db, _awsS3Svc, _nrApiSvc) {
    this.db = _db;
    this.awsS3Svc = _awsS3Svc;
    this.nrApiSvc = _nrApiSvc;
  }

  async getMasterAccounts() {
    const accounts = await this.db.getMasterAccounts();

    if (accounts === null) {
      return { success: false, message: "No master accounts found!" };
    }

    return {
      success: true,
      message: "Get active dispensary accounts successful.",
      accounts: accounts
    };
  }

  async getMasterAccountById(id) {
    const resp = await this.db.getMasterAccountById(id);
    return resp;
  }

  async getDispensaryAccountById(id) {
    const resp = await this.db.getDispensaryAccountById(id);
    return resp;
  }

  async createMaster(name, ownerEmail) {
    const resp = await this.db.createAccount(name, ownerEmail, "MASTER");
    return resp;
  }

  async updateDispensaryLogo(file, accountId) {
    const resp = await this.awsS3Svc.uploadDispensaryLogo(file, accountId);
    if (!resp.success) {
      return resp;
    }
    const updateDb = await this.db.updateDispensaryLogo(resp.logo, accountId);
    if (!updateDb.success) {
      return updateDb;
    }
    return resp;
  }

  async updateDispensaryAddress(accountId, dispensaryInfo) {
    const resp = await this.db.updateDispensaryAddress(accountId, dispensaryInfo);
    return resp;
  }

  async updateMasterName(accountId, name) {
    const resp = await this.db.updateMasterName(accountId, name);
    return resp;
  }

  async createDispensaryAccount(masterAccountId, name, email) {
    const resp = await this.db.createDispensaryAccount(masterAccountId, name, email);
    if (!resp.success) {
      return resp;
    }

    let chartLinks = [];
    const chart1Resp = await this.nrApiSvc.createReliefOrHighEmbedUrl(resp.account.id);
    const chart2Resp = await this.nrApiSvc.createFeelEmbedUrl(resp.account.id);
    const chart3Resp = await this.nrApiSvc.createStrainEmbedUrl(resp.account.id);
    chartLinks.push(chart1Resp.embedUrl);
    chartLinks.push(chart2Resp.embedUrl);
    chartLinks.push(chart3Resp.embedUrl);

    const updateResp = await this.db.updateDispensaryCharts(resp.account.id, chartLinks);
    if (!updateResp.success) {
      return updateResp;
    }
    return {
      success: true,
      message: "Successfully created Dispensary Account."
    };
  }

  async deleteDispensaryAccount(accountId) {
    const resp = await this.db.deleteDispensaryAccount(accountId);
    return resp;
  }

  async addUserToMaster(accountId, email) {
    const resp = await this.db.addUserToMaster(accountId, email);
    return resp;
  }

  async addUserToDispensary(accountId, email) {
    const resp = await this.db.addUserToDispensary(accountId, email);
    return resp;
  }

  async deleteUserFromMaster(accountId, email) {
    const resp = await this.db.deleteUserFromMaster(accountId, email);
    return resp;
  }

  async deleteUserFromDispensary(accountId, email) {
    const resp = await this.db.deleteUserFromDispensary(accountId, email);
    return resp;
  }
}

export default AccountService;
