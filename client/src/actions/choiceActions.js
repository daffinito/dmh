import { SET_CHOICE, RESET_CHOICE } from './types'

export function setChoice(choice) {
    return (dispatch) => {
        dispatch({
            type: SET_CHOICE,
            payload: {
                choice: choice,
            }
        })
    }
}

export function resetChoice() {
    return (dispatch) => {
        dispatch({
            type: RESET_CHOICE,
            payload: {
                choice: {
                    id: -1,
                    description: "",
                }
            }
        })
    }
}
