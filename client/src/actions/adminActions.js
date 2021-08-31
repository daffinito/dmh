import axios from "axios";
import {
  GET_MASTER_ACCOUNTS,
  GET_PENDING_USERS,
  CREATE_USER,
  CREATE_MASTER_ACCOUNT,
  GET_SUPPRESSION_LIST,
  DELETE_SUPPRESSION,
  ADMIN_GET_USER,
  ADMIN_DELETE_USER
} from "./types";

const API_ROOT = "/api";

export function getMasterAccounts() {
  return dispatch => {
    axios.post(`${API_ROOT}/account/master/all`).then(response => {
      dispatch({
        type: GET_MASTER_ACCOUNTS,
        payload: response.data
      });
    });
  };
}

export function getPendingUsers() {
  return dispatch => {
    axios.post(`${API_ROOT}/user/pending`).then(response => {
      dispatch({
        type: GET_PENDING_USERS,
        payload: response.data
      });
    });
  };
}

export function createUser(email, name) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/user/create/dispensary`, {
        email: email,
        name: name
      })
      .then(response => {
        let payload = response.data;
        payload.email = email;
        dispatch({
          type: CREATE_USER,
          payload: payload
        });
      });
  };
}

export function createMasterAccount(name) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/account/master/create`, {
        name: name
      })
      .then(response => {
        dispatch({
          type: CREATE_MASTER_ACCOUNT,
          payload: response.data
        });
      });
  };
}

export function getSuppressionList() {
  return dispatch => {
    axios.post(`${API_ROOT}/admin/suppressionlist/get`).then(response => {
      dispatch({ type: GET_SUPPRESSION_LIST, payload: response.data });
    });
  };
}

export function deleteSuppression(id) {
  return dispatch => {
    axios.delete(`${API_ROOT}/admin/suppression/${id}`).then(response => {
      dispatch({ type: DELETE_SUPPRESSION, payload: response.data });
    });
  };
}

export function adminGetUser(email) {
  return dispatch => {
    axios.post(`${API_ROOT}/user/get/email=${email}&include_accounts=true`).then(response => {
      dispatch({
        type: ADMIN_GET_USER,
        payload: response.data
      });
    });
  };
}

export function adminDeleteUser(id) {
  return dispatch => {
    axios.delete(`${API_ROOT}/admin/user/${id}`).then(response => {
      dispatch({ type: ADMIN_DELETE_USER, payload: response.data });
    });
  };
}
