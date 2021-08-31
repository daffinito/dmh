import { SET_CHOICE, RESET_CHOICE } from '../actions/types';

const DEFAULT_STATE = {
  choice: {
    id: -1,
    description: "",
  },
};

// refactor this to use spread operator
export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_CHOICE:
      return Object.assign({}, state, {
        choice: action.payload.choice,
      });
    case RESET_CHOICE:
      return Object.assign({}, state, {
        choice: action.payload.choice,
      });

    default:
      return state;
  }
};