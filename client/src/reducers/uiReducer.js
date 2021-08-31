import { SCREEN_RESIZE } from '../actions/types'

const DEFAULT_STATE = {
  screenWidth: typeof window === 'object' ? window.innerWidth : null,
}

// refactor this to use spread operator
export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SCREEN_RESIZE:
      return Object.assign({}, state, {
        screenWidth: action.payload.screenWidth
      })
    default:
      return state;
  }
}
