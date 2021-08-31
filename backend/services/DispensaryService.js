import HelpersService from "./HelpersService";

const newrelic = require("newrelic");

class DispensaryService {
  constructor(_db, _cache, _googleMaps, _ipgeo) {
    this.googleMaps = _googleMaps;
    this.ipgeo = _ipgeo;
    this.cache = _cache;
    this.db = _db;
    this.helpers = new HelpersService();
  }

  async getDispensarySuggestion(point, zip) {
    const randomNum = this.helpers.randomNumber(1, 100);
    const forceSubscription = randomNum > 80 ? false : true;

    console.log("forceSub: ", forceSubscription);

    if (point === null || zip === null) {
      newrelic.addCustomAttribute("dispensaryPushingRandom", "true");
      const randomLocalDisp = await this.db.getRandomDispensary();
      return randomLocalDisp;
    }

    if (forceSubscription) {
      const localDispensary = await this.db.getDispensaryByZip(zip);
      if (localDispensary === null) {
        const dispensaryData = await this.googleMaps.findNearestDispensary(point);
        if (!dispensaryData.success) {
          const randomLocalDisp = await this.db.getRandomDispensary();
          newrelic.addCustomAttribute("dispensaryPushingRandom", "true");
          return randomLocalDisp;
        }
        newrelic.addCustomAttribute("dispensaryPushToSub", "false");
        return dispensaryData;
      }
      newrelic.addCustomAttribute("dispensaryPushToSub", "true");
      return localDispensary;
    }

    const dispensaryData = await this.googleMaps.findNearestDispensary(point);
    if (dispensaryData.success) {
      newrelic.addCustomAttribute("dispensaryPushToSub", "false");
      return dispensaryData;
    }

    newrelic.addCustomAttribute("dispensaryPushToSub", "true");
    const localDispensary = await this.db.getDispensaryByZip(zip);
    if (localDispensary === null) {
      newrelic.addCustomAttribute("dispensaryPushingRandom", "true");
      const randomLocalDisp = await this.db.getRandomDispensary();
      return randomLocalDisp;
    }
    return localDispensary;
  }

  async getDispensaryByAccountId(accountId) {
    if (typeof accountId === "undefined") {
      return {
        success: false,
        message: "No account ID specified"
      };
    }

    const key = `dispensaryByAccountId_${accountId}`;
    const dispensary = await this.cache.get(key, () => this.db.getDispensaryByAccountId(accountId));
    return Promise.resolve(dispensary);
  }
}

export default DispensaryService;
