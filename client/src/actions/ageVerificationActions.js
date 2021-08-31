import axios from "axios";
import { RECORD_AGEVERIFICATION, INIT_AGEVERIFICATION } from "./types";

const API_ROOT = "/api";

export function record_ageverification(isOver21) {
  return dispatch => {
    axios.post(`${API_ROOT}/ageverification`, {
      data: {
        isOver21: isOver21
      }
    });  // fire and forget, don't care about response, just recording in db

    dispatch({
      type: RECORD_AGEVERIFICATION,
      payload: {
        isOver21: isOver21
      }
    });
  };
}

export function init_ageverification(isOver21) {
  return dispatch => {
    dispatch({
      type: INIT_AGEVERIFICATION,
      payload: {
        isOver21: isOver21
      }
    });
  };
}