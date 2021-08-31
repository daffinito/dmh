import axios from "axios";
import { GET_RESULT, CLEAR_RESULT } from "./types";

const API_ROOT = "/api";

const CLEAR_STATE = {
  success: null,
  message: null,
  strain: {},
  dispensary: {}
};

export function getResult(selections, point, zip) {
  const newSelections = [];

  for (let s of selections) {
    newSelections.push({
      choiceId: s.choice.id,
      description: s.choice.description
    });
  }

  return dispatch => {
    axios
      .post(`${API_ROOT}/get/result`, {
        selections: newSelections,
        point: point,
        zip: zip
      })
      .then(response => {
        dispatch({
          type: GET_RESULT,
          payload: response.data
        });
      });
  };
}

export function clearResult() {
  return dispatch => {
    dispatch({
      type: CLEAR_RESULT,
      payload: CLEAR_STATE
    });
  };
}
