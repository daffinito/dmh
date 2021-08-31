import axios from "axios";

class IpGeo {
  constructor(_cache) {
    this.API_ROOT = "http://api.ipstack.com/";
    this.API_KEY = process.env.IPSTACK_API_KEY;
    this.cache = _cache;
    this.localhost = {
      ip: "127.0.0.1",
      type: "ipv4",
      continent_code: "NA",
      continent_name: "North America",
      country_code: "US",
      country_name: "United States",
      region_code: "OR",
      region_name: "Oregon",
      city: "Portland",
      zip: 97212,
      latitude: 45.5485,
      longitude: -122.6533,
      location: {
        geoname_id: 5711906,
        capital: "Washington D.C.",
        languages: {
          code: "en",
          name: "English"
        },
        native: '"English"',
        country_flag: "http://assets.ipstack.com/flags/us.svg",
        country_flag_emoji: "🇺🇸",
        country_flag_emoji_unicode: "U+1F1FA U+1F1F8",
        calling_code: "1",
        is_eu: false
      }
    };
  }

  get(ip) {
    if (ip === "127.0.0.1") {
      console.log("IP is localhost, using test data");
      return Promise.resolve(this.localhost);
    }
    const key = `ipgeo_${ip}`;
    const uri = `${this.API_ROOT}/${ip}?access_key=${this.API_KEY}`;

    return this.cache
      .get(key, () => Promise.resolve(axios.get(uri)))
      .then(resp => {
        //console.log(resp)
        return resp.data;
      });
  }
}

export default IpGeo;
