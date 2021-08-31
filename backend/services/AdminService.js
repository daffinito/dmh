const newrelic = require("newrelic");

class AdminService {
  constructor(_db) {
    this.db = _db;
  }

  async getSuppressionList() {
    const resp = await this.db.getSuppressionList();
    return resp;
  }

  async deleteSuppression(id) {
    const resp = await this.db.deleteSuppression(id);
    return resp;
  }

  async deleteUser(id) {
    const resp = await this.db.deleteUser(id);
    return resp;
  }
 
}

export default AdminService;
