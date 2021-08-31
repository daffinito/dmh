import axios from "axios";

class BingMaps {
  constructor(_cache) {
    this.API_KEY = process.env.BING_API_KEY;
    this.API_ROOT = "http://dev.virtualearth.net/REST/v1";
    this.API_KEY_QUERYSTRING = `key=${this.API_KEY}`;
    this.cache = _cache;
  }

  fromPoint(point) {
    const key = `rvsgeocode_${point}`;
    const endpoint = `Locations`;
    const getStateAndZipOnlyQS = "includeEntityTypes=Postcode1";
    const uri = `${this.API_ROOT}/${endpoint}/${point}?${getStateAndZipOnlyQS}&${this.API_KEY_QUERYSTRING}`;

    return this.cache
      .get(key, () => Promise.resolve(axios.get(uri)))
      .then(resp => {
        return resp;
      });
  }
}

export default BingMaps;
