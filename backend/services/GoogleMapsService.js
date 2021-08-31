import axios from "axios";
// https://developers.google.com/places/web-service/search

class GoogleMaps {
  constructor(_cache) {
    this.API_KEY = process.env.GOOGLE_API_KEY;
    this.API_ROOT = "https://maps.googleapis.com/maps/api";
    this.API_KEY_QUERYSTRING = `key=${this.API_KEY}`;
    this.cache = _cache;
  }

  getDetails(plcId) {
    //https://maps.googleapis.com/maps/api/place/details/json?
    //placeid=ChIJQ-2n9UinlVQRtok7iWEbk7o&
    //fields=name,address_component,geometry/location&
    //key=REMOVED

    const key = `placedetails_${plcId}`;
    const endpoint = `place/details`;
    const output = `json`;
    const fields = "name,address_component,formatted_address,geometry/location";
    const placeId = `placeid=${plcId}`;
    const uri = `${this.API_ROOT}/${endpoint}/${output}?${fields}&${placeId}&${this.API_KEY_QUERYSTRING}`;

    return this.cache
      .get(key, () => Promise.resolve(axios.get(uri)))
      .then(r => {
        if (r.data.status === "OK") {
          const result = r.data.result;
          const zip = result.address_components.find(c => c.types[0] === "postal_code").long_name;
          return {
            place_id: plcId,
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            name: result.name,
            address: result.formatted_address,
            zip: zip,
            success: true
          };
        } else {
          return {
            success: false
          };
        }
      });
  }

  findNearestDispensary(userLocation) {
    //https://maps.googleapis.com/maps/api/place/nearbysearch/output?parameters

    const key = `dispensary_${userLocation}`;
    const endpoint = `place/nearbysearch`;
    const location = `location=${userLocation}`;
    const searchKeyword = "keyword=cannabis+dispensary";
    const rankByDistance = "rankby=distance";
    const output = `json`;
    const uri = `${this.API_ROOT}/${endpoint}/${output}?${searchKeyword}&${location}&${rankByDistance}&${this.API_KEY_QUERYSTRING}`;

    return this.cache
      .get(key, () => Promise.resolve(axios.get(uri)))
      .then(resp => {
        const data = resp.data;
        if (data.results.length > 0) {
          return this.getDetails(data.results[0].place_id);
        } else {
          return {
            success: false
          };
        }
      });
  }

  placeSearch(query) {
    //https://maps.googleapis.com/maps/api/place/findplacefromtext/output?parameters

    const key = `placeSearch_${query}`;
    const endpoint = `place/findplacefromtext`;
    const input = `input=${query}`;
    const inputtype = `inputtype=textquery`;
    const fields = `fields=place_id,formatted_address,name,geometry/location`
    const output = `json`;
    const uri = `${this.API_ROOT}/${endpoint}/${output}?${input}&${inputtype}&${fields}&${this.API_KEY_QUERYSTRING}`;

    return this.cache
      .get(key, () => Promise.resolve(axios.get(uri)))
      .then(resp => {
        const data = resp.data;
        //console.log(data)
        if (data.candidates.length > 0) {
          let response = {
            success: true,
            message: "Success",
            dispensaryInfo: {
              place_id: data.candidates[0].place_id,
              address: data.candidates[0].formatted_address,
              name: data.candidates[0].name,
              lat: data.candidates[0].geometry.location.lat,
              lng: data.candidates[0].geometry.location.lng

            }
          }
          
          return response;
        } else {
          return {
            success: false,
            message: "No results found."
          };
        }
      });
  }
}

export default GoogleMaps;
