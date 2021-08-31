import { RECORD_AGEVERIFICATION, INIT_AGEVERIFICATION } from "../actions/types";

const DEFAULT_STATE = {
  isOver21: false
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case RECORD_AGEVERIFICATION:
      return action.payload;
    case INIT_AGEVERIFICATION:
      return action.payload;
    default:
      return state;
  }
};
