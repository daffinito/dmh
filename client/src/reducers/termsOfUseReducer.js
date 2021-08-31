import { RECORD_TERMS_RESPONSE, INIT_TERMS_RESPONSE } from "../actions/types";

const DEFAULT_STATE = {
  canEnterSite: false
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case RECORD_TERMS_RESPONSE:
      return action.payload;
    case INIT_TERMS_RESPONSE:
      return action.payload;
    default:
      return state;
  }
};
