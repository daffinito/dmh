import { ADD_SELECTION, UPDATE_SELECTION, REMOVE_SELECTION } from '../actions/types';

const DEFAULT_STATE = {
  selections: [],
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {

    case ADD_SELECTION:
      return {
        ...state,
        selections: [...state.selections, {
          questionId: action.payload.questionId,
          question: action.payload.question,
          choice: action.payload.choice,
          dialPosition: action.payload.dialPosition,
          numberOfChoices: action.payload.numberOfChoices,
          dialAngle: action.payload.dialAngle
        }],
      }

    case UPDATE_SELECTION:
      return {
        ...state,
        selections: state.selections.map(
          s => s.questionId === action.payload.questionId ? {
            questionId: action.payload.questionId,
            question: action.payload.question,
            choice: action.payload.choice,
            dialPosition: action.payload.dialPosition,
            numberOfChoices: action.payload.numberOfChoices,
            dialAngle: action.payload.dialAngle
          }
            : s
        )
      }

    case REMOVE_SELECTION:
      return {
        ...state,
        selections: state.selections.filter(s => s.questionId !== action.payload.questionId)
      }
    default:
      return state;
  }
};


