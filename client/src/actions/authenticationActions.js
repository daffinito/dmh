import axios from "axios";
import { SUBMIT_LOGIN } from "./types";

const API_ROOT = "/api/user";

export function login(email, password) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/login`, {
        email: email,
        password: password
      })
      .then(response => {
        dispatch({
          type: SUBMIT_LOGIN,
          payload: {
            email: email,
            data: response.data
          }
        });
      });
  };
}

