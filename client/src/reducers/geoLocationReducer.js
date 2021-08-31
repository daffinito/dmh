import { GET_GEOLOCATION, INIT_GEOLOCATION, SET_GEOLOADING, GEOERROR, GEO_BROWSERSUPPORTED } from "../actions/types";

const DEFAULT_STATE = {
  enabled: true,
  state: null,
  isLegal: false,
  point: "",
  zip: "",
  supportsGeoLoc: true,
  accessBlocked: false,
  geolocationError: false,
  requestingAccess: true,
  loadingGeoData: false,
  finishedGatheringGeoData: false
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_GEOLOCATION:
      return {
        ...state,
        point: action.payload.point,
        state: action.payload.state,
        zip: action.payload.zip,
        isLegal: action.payload.isLegal,
        loadingGeoData: action.payload.loadingGeoData,
        finishedGatheringGeoData: action.payload.finishedGatheringGeoData
      };

    case INIT_GEOLOCATION:
      return { ...state,  state: action.payload.state, isLegal: action.payload.isLegal, enabled: action.payload.enabled };

    case SET_GEOLOADING:
      return { ...state, loadingGeoData: action.payload.loadingGeoData, requestingAccess: action.payload.requestingAccess };

    case GEOERROR:
      return { ...state, requestingAccess: action.payload.requestingAccess, accessBlocked: action.payload.accessBlocked };

    case GEO_BROWSERSUPPORTED:
      return { ...state, supportsGeoLoc: action.payload.supportsGeoLoc };

    default:
      return state;
  }
};
