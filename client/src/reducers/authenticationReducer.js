import { SUBMIT_LOGIN } from "../actions/types";

const DEFAULT_STATE = {
  email: "",
  success: false,
  userExists: false
};

// refactor this to use spread operator
export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SUBMIT_LOGIN:
      return Object.assign({}, state, {
        email: action.payload.email,
        success: action.payload.data.success,
        userExists: action.payload.data.userExists
      });
    default:
      return state;
  }
};
