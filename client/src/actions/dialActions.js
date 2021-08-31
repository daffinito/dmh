import { SET_POSITION, SET_CURRENT_MAXANGLE } from './types'

export function setDialPosition(p) {
    return (dispatch) => {
        dispatch({
            type: SET_POSITION,
            payload: {
                position: p,
            }
        })
    }
}

export function setCurMaxAngle(a) {
    return (dispatch) => {
        dispatch({
            type: SET_CURRENT_MAXANGLE,
            payload: {
                angle: a,
            }
        })
    }
}
