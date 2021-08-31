import { GET_QUESTION, CLEAR_QUESTION } from '../actions/types';

const DEFAULT_STATE = {
  questionId: -1,
  question: "Loading...",
  choices: [{
    id: -1,
    description: ""
  },
  {
    id: -1,
    description: ""
  }],
  followUpQuestions: null,
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_QUESTION:
      return action.payload;
    case CLEAR_QUESTION:
      return action.payload;
    default:
      return state;
  }
};
