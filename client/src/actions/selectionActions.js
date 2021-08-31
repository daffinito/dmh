import { ADD_SELECTION, UPDATE_SELECTION, REMOVE_SELECTION } from './types'

export function addSelection(questionId, question, choice, dialPosition, dialAngle, numberOfChoices) {
  return (dispatch, getState) => {
    const state = getState()
    let alreadyExists = false
    if (typeof state.selectionCache.selections !== 'undefined') {
      alreadyExists = typeof state.selectionCache.selections.find(s => s.questionId === questionId) !== 'undefined'
    }
    if (!alreadyExists) {
      dispatch({
        type: ADD_SELECTION,
        payload: {
          questionId: questionId,
          question: question,
          choice: choice,
          dialPosition: dialPosition,
          numberOfChoices: numberOfChoices,
          dialAngle: dialAngle,
        }
      });
    } else {
      dispatch({
        type: UPDATE_SELECTION,
        payload: {
          questionId: questionId,
          question: question,
          choice: choice,
          dialPosition: dialPosition,
          numberOfChoices: numberOfChoices,
          dialAngle: dialAngle,
        }
      });
    };
  }
}

export function removeSelection(questionId) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_SELECTION,
      payload: {
        questionId: questionId,
      }
    })
  }
}

// TODO: ADD CLEAR SELECTION ACTION

