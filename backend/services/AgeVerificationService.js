class AgeVerificationService {
  constructor(_db) {
    this.db = _db;
  }

  add(ip, zip, isOver21) {
    return this.db.addAgeVerification(ip, zip, isOver21).then(resp => {
      return resp;
    });
  }
}

export default AgeVerificationService;
