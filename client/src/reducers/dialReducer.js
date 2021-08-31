import { SET_POSITION, SET_CURRENT_MAXANGLE } from "../actions/types";

const DEFAULT_STATE = {
  position: 0,
  angle: 160
};

// refactor this to use spread operator
export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_POSITION:
      return Object.assign({}, state, {
        position: action.payload.position
      });
    case SET_CURRENT_MAXANGLE:
      return Object.assign({}, state, {
        angle: action.payload.angle
      });

    default:
      return state;
  }
};
