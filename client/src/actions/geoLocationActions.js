import axios from "axios";
import { GET_GEOLOCATION, INIT_GEOLOCATION, SET_GEOLOADING, GEOERROR, GEO_BROWSERSUPPORTED } from "./types";

const API_ROOT = "/api";

export function getGeoLocation(point) {
  return dispatch => {
    axios.post(`${API_ROOT}/get/geo/${point}`).then(response => {
      dispatch({
        type: GET_GEOLOCATION,
        payload: {
          point: point,
          state: response.data.state,
          zip: response.data.zip,
          isLegal: response.data.isLegal,
          loadingGeoData: false,
          finishedGatheringGeoData: true
        }
      });
    });
  };
}

export function initGeoLocation(enabled, state, isLegal) {
  return dispatch => {
    dispatch({
      type: INIT_GEOLOCATION,
      payload: { enabled: enabled, state: state, isLegal: isLegal }
    });
  };
}

export function setGeoLoading() {
  return dispatch => {
    dispatch({
      type: SET_GEOLOADING,
      payload: { loadingGeoData: true, requestingAccess: false }
    });
  };
}

export function geoError(wasPermissionsError) {
  return dispatch => {
    if (wasPermissionsError) {
      dispatch({
        type: GEOERROR,
        payload: {
          loadingGeoData: false,
          finishedGatheringGeoData: true,
          requestingAccess: false,
          accessBlocked: true
        }
      });
    } else {
      dispatch({
        type: GEOERROR,
        payload: {
          loadingGeoData: false,
          finishedGatheringGeoData: true,
          requestingAccess: false,
          geolocationError: true
        }
      });
    }
  };
}

export function geoBrowserSupported(supportsGeoLoc) {
  return dispatch => {
    dispatch({
      type: GEO_BROWSERSUPPORTED,
      payload: { supportsGeoLoc: supportsGeoLoc }
    });
  };
}
