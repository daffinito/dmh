import { SCREEN_RESIZE } from './types'

export function handleResize(width) {
  return (dispatch) => {
    dispatch({
      type: SCREEN_RESIZE,
      payload: {
        screenWidth: width,
      }
    });
  };
}
