import { GET_RESULT, CLEAR_RESULT } from "../actions/types";

const DEFAULT_STATE = {
  success: null,
  message: null,
  strain: {},
  dispensary: {}
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_RESULT:
      return action.payload;
    case CLEAR_RESULT:
      return action.payload;
    default:
      return state;
  }
};
