import axios from "axios";
import {
  CHANGE_DISPENSARY_LOGO,
  CHANGE_DISPENSARY_ADDRESS,
  CHECK_DISPENSARY_ADDRESS,
  GET_USERS_BY_ACCOUNT,
  GET_PENDING_USERS_BY_ACCOUNT,
  CREATE_DISPENSARY_ADDRESS,
  DELETE_DISPENSARY_ADDRESS,
  CHANGE_MASTER_NAME,
  ADD_USER_TO_MASTER,
  ADD_USER_TO_DISPENSARY,
  DELETE_USER_FROM_MASTER,
  DELETE_USER_FROM_DISPENSARY,
  GET_CUSTOM_STRAINS,
  ADD_CUSTOM_STRAIN,
  DELETE_CUSTOM_STRAIN,
  GET_MASTER_BY_ACCOUNT_ID,
  GET_DISPENSARY_ACCOUNT_BY_ID
} from "./types";

const API_ROOT = "/api/account";

export function changeDispensaryLogo(image, accountId) {
  let data = new FormData();
  data.append("file", image);
  data.append("accountId", accountId);

  return dispatch => {
    axios
      .put(`${API_ROOT}/dispensary/logo`, data)
      .then(response => {
        dispatch({
          type: CHANGE_DISPENSARY_LOGO,
          payload: response.data
        });
      })
      .catch(err => {
        dispatch({
          type: CHANGE_DISPENSARY_LOGO,
          payload: {
            success: false,
            message: err,
            logo: null
          }
        });
      });
  };
}

export function checkDispensaryAddress(name, street, city, state, zip) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/dispensary/checkaddress`, {
        name: name,
        street: street,
        city: city,
        state: state,
        zip: zip
      })
      .then(response => {
        dispatch({
          type: CHECK_DISPENSARY_ADDRESS,
          payload: response.data
        });
      });
  };
}

export function changeDispensaryAddress(accountId, dispensaryInfo) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/dispensary/address`, {
        accountId: accountId,
        dispensaryInfo: dispensaryInfo
      })
      .then(response => {
        dispatch({
          type: CHANGE_DISPENSARY_ADDRESS,
          payload: response.data
        });
      });
  };
}

export function createDispensaryAccount(masterAccountId, name) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/dispensary/create`, {
        name: name,
        masterAccountId: masterAccountId
      })
      .then(response => {
        dispatch({
          type: CREATE_DISPENSARY_ADDRESS,
          payload: response.data
        });
      });
  };
}

export function deleteDispensaryAccount(accountId) {
  return dispatch => {
    axios.delete(`${API_ROOT}/dispensary/${accountId}`).then(response => {
      dispatch({
        type: DELETE_DISPENSARY_ADDRESS,
        payload: response.data
      });
    });
  };
}

export function getUsersByAccount(accountId, isMaster) {
  let uri;
  if (isMaster) {
    uri = `${API_ROOT}/master/${accountId}/users`;
  } else {
    uri = `${API_ROOT}/dispensary/${accountId}/users`;
  }

  return dispatch => {
    axios.post(uri).then(response => {
      dispatch({
        type: GET_USERS_BY_ACCOUNT,
        payload: response.data
      });
    });
  };
}

export function getPendingUsersByAccount(accountId, isMaster) {
  let uri;
  if (isMaster) {
    uri = `${API_ROOT}/master/${accountId}/users/pending`;
  } else {
    uri = `${API_ROOT}/dispensary/${accountId}/users/pending`;
  }

  return dispatch => {
    axios.post(uri).then(response => {
      dispatch({
        type: GET_PENDING_USERS_BY_ACCOUNT,
        payload: response.data
      });
    });
  };
}

export function changeMasterName(accountId, name) {
  return dispatch => {
    axios
      .put(`${API_ROOT}/master/name`, {
        accountId: accountId,
        name: name
      })
      .then(response => {
        dispatch({
          type: CHANGE_MASTER_NAME,
          payload: response.data
        });
      });
  };
}

export function addUserToMaster(accountId, email) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/master/adduser`, {
        accountId: accountId,
        email: email
      })
      .then(response => {
        dispatch({
          type: ADD_USER_TO_MASTER,
          payload: response.data
        });
      });
  };
}

export function addUserToDispensary(accountId, email) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/dispensary/adduser`, {
        accountId: accountId,
        email: email
      })
      .then(response => {
        dispatch({
          type: ADD_USER_TO_DISPENSARY,
          payload: response.data
        });
      });
  };
}

export function deleteUserFromMaster(accountId, email) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/master/deleteuser`, {
        accountId: accountId,
        email: email
      })
      .then(response => {
        dispatch({
          type: DELETE_USER_FROM_MASTER,
          payload: response.data
        });
      });
  };
}

export function deleteUserFromDispensary(accountId, email) {
  return dispatch => {
    axios
      .post(`${API_ROOT}/dispensary/deleteuser`, {
        accountId: accountId,
        email: email
      })
      .then(response => {
        dispatch({
          type: DELETE_USER_FROM_DISPENSARY,
          payload: response.data
        });
      });
  };
}

export function getCustomStrains(accountId) {
  return dispatch => {
    axios.post(`${API_ROOT}/dispensary/${accountId}/strains`).then(response => {
      dispatch({
        type: GET_CUSTOM_STRAINS,
        payload: response.data
      });
    });
  };
}

export function addCustomStrain(accountId, strainInfo) {
  let data = new FormData();
  if (strainInfo.file !== null) {
    data.append("file", strainInfo.file);
  }
  delete strainInfo.file;
  data.append("name", strainInfo.name);
  data.append("type", strainInfo.type);
  data.append("description", strainInfo.description);
  data.append("choices", strainInfo.choices);
  return dispatch => {
    axios
      .post(`${API_ROOT}/dispensary/${accountId}/addstrain`, data)
      .then(response => {
        dispatch({
          type: ADD_CUSTOM_STRAIN,
          payload: response.data
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: ADD_CUSTOM_STRAIN,
          payload: {
            success: false,
            message: err,
            logo: null
          }
        });
      });
  };
}

export function deleteCustomStrain(accountId, strainId) {
  return dispatch => {
    axios
      .delete(`${API_ROOT}/dispensary/${accountId}/deletestrain/${strainId}`)
      .then(response => {
        dispatch({
          type: DELETE_CUSTOM_STRAIN,
          payload: response.data
        });
      });
  };
}

export function getMasterAccountById(accountId) {
  return dispatch => {
    axios.post(`${API_ROOT}/master/${accountId}/get`).then(response => {
      dispatch({
        type: GET_MASTER_BY_ACCOUNT_ID,
        payload: response.data
      });
    });
  };
}

export function getDispensaryAccountById(accountId) {
  return dispatch => {
    axios.post(`${API_ROOT}/dispensary/${accountId}/get`).then(response => {
      dispatch({
        type: GET_DISPENSARY_ACCOUNT_BY_ID,
        payload: response.data
      });
    });
  };
}