import {  GET_DISPENSARY_BY_ACCOUNT } from "../actions/types";

const DEFAULT_STATE = {
  getDispensaryByAccount: {
    success: null,
    message: null
  },
  name: "",
  place_id: "",
  address: "",
  lat: 0,
  lng: 0,
  zip: ""
};

// refactor this to use spread operator
export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_DISPENSARY_BY_ACCOUNT:
      return Object.assign({}, state, {
        getDispensaryByAccount: {
          success: action.payload.success,
          message: action.payload.message
        },
        name: action.payload.dispensary.name,
        place_id: action.payload.dispensary.place_id,
        address: action.payload.dispensary.address,
        lat: action.payload.dispensary.lat,
        lng: action.payload.dispensary.lng,
        zip: action.payload.dispensary.zip
      });
    default:
      return state;
  }
};
