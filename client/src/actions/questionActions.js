import axios from 'axios';
import { GET_QUESTION, CLEAR_QUESTION } from './types';

const API_ROOT = '/api';

const CLEAR_STATE = {
    questionId: 0,
    question: "",
    choices: [{
        id: 0,
        description: ""
    },
    {
        id: 0,
        description: ""
    },
    {
        id: 0,
        description: ""
    }],
    followUpQuestions: null,
}

export function getQuestionById(qid) {
    return (dispatch) => {
        axios.get(`${API_ROOT}/get/q/${qid}`).then((response) => {
            dispatch({
                type: GET_QUESTION,
                payload: response.data,
            });
        });
    };
}

export function clearQuestion() {
    return (dispatch) => {
        dispatch({
            type: CLEAR_QUESTION,
            payload: CLEAR_STATE,
        })
    }
}