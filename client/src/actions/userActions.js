import axios from "axios";
import {
  GET_USER,
  GET_USER_BY_TOKEN,
  GET_USER_WITH_ACCOUNTS,
  CHANGE_PASSWORD,
  SET_PASSWORD,
  FULL_LOGIN,
  LOGOUT,
  CHECK_SESSION,
  UPDATE_USER_SETTINGS,
  SET_NEW_USER_PREFS,
  FORGOT_PASSWORD,
  RESEND_PENDING_EMAIL
} from "./types";

const API_ROOT = "/api/user";

export function getUserByEmail(email) {
  return dispatch => {
    axios.post(`${API_ROOT}/get/email=${email}`).then(response => {
      dispatch({
        type: GET_USER,
        payload: response.data
      });
    });
  };
}

export function getUserWithAccountsByEmail(email) {
  return dispatch => {
    axios.post(`${API_ROOT}/get/email=${email}&include_accounts=true`).then(response => {
      dispatch({
        type: GET_USER_WITH_ACCOUNTS,
        payload: response.data
      });
    });
  };
}

export function getUserByToken(token) {
  return dispatch => {
    axios.post(`${API_ROOT}/get/token=${token}`).then(response => {
      dispatch({
        type: GET_USER_BY_TOKEN,
        payload: response.data
      });
    });
  };
}

export function fullLogin(email, password) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/login`, {
        email: email,
        password: password,
        includeAccounts: true
      })
      .then(response => {
        dispatch({
          type: FULL_LOGIN,
          payload: response.data
        });
      });
  };
}

export function changePassword(email, password) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/change/password`, {
        email: email,
        password: password
      })
      .then(response => {
        dispatch({
          type: CHANGE_PASSWORD,
          payload: response.data
        });
      });
  };
}

export function setPassword(email, password, token) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/set/password`, {
        email: email,
        password: password,
        token: token
      })
      .then(response => {
        dispatch({
          type: SET_PASSWORD,
          payload: response.data
        });
      });
  };
}

export function forgotPassword(email) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/forgotpassword`, {
        email: email
      })
      .then(response => {
        dispatch({
          type: FORGOT_PASSWORD,
          payload: response.data
        });
      });
  };
}

export function setNewUserPrefs(settings) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/new/settings`, {
        email: settings.email,
        name: settings.name,
        password: settings.password,
        token: settings.token
      })
      .then(response => {
        dispatch({
          type: SET_NEW_USER_PREFS,
          payload: response.data
        });
      });
  };
}

export function updateUserSettings(settings) {
  return dispatch => {
    axios
      .put(`${API_ROOT}/change/settings`, {
        email: settings.email,
        name: settings.name,
        oldPassword: settings.oldPassword,
        newPassword: settings.newPassword
      })
      .then(response => {
        dispatch({
          type: UPDATE_USER_SETTINGS,
          payload: response.data
        });
      });
  };
}

export function checkSession() {
  return dispatch => {
    axios.post(`${API_ROOT}/checksession`).then(response => {
      dispatch({
        type: CHECK_SESSION,
        payload: response.data
      });
    });
  };
}

export function resendPendingEmail(id) {
  return dispatch => {
    axios.post(`${API_ROOT}/pending/resend/${id}`).then(response => {
      dispatch({
        type: RESEND_PENDING_EMAIL,
        payload: response.data
      });
    });
  };
}

export function logout() {
  return dispatch => {
    axios.post(`${API_ROOT}/logout`).then(response => {
      dispatch({
        type: LOGOUT,
        payload: response.data
      });
    });
  };
}
