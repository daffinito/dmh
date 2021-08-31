//import axios from "axios";
import { RECORD_TERMS_RESPONSE, INIT_TERMS_RESPONSE } from "./types";

//const API_ROOT = "/api";

export function recordTermsResponse(canEnterSite) {
  return dispatch => {
    /*axios.post(`${API_ROOT}/termsofuseresponse`, {
      data: {
        canEnterSite: canEnterSite
      }
    }); // fire and forget, don't care about response, just recording in db
    // we aren't recording this anymore, this does nothing.
*/
    dispatch({
      type: RECORD_TERMS_RESPONSE,
      payload: {
        canEnterSite: canEnterSite
      }
    });
  };
}

export function initTermsResponse(canEnterSite) {
  return dispatch => {
    dispatch({
      type: INIT_TERMS_RESPONSE,
      payload: {
        canEnterSite: canEnterSite
      }
    });
  };
}
