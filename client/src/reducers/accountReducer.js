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
  DELETE_USER_FROM_DISPENSARY,
  DELETE_USER_FROM_MASTER,
  GET_CUSTOM_STRAINS,
  ADD_CUSTOM_STRAIN,
  DELETE_CUSTOM_STRAIN,
  GET_MASTER_BY_ACCOUNT_ID,
  GET_DISPENSARY_ACCOUNT_BY_ID
} from "../actions/types";

const DEFAULT_STATE = {
  changeDispensaryLogo: {
    success: null,
    message: null,
    logo: null
  },
  checkDispensaryAddress: {
    success: null,
    message: null,
    dispensaryInfo: null
  },
  changeDispensaryAddress: {
    success: null,
    message: null
  },
  getUsersByAccount: {
    success: null,
    message: null,
    users: []
  },
  getPendingUsersByAccount: {
    success: null,
    message: null,
    users: []
  },
  createDispensaryAccount: {
    success: null,
    message: null
  },
  deleteDispensaryAccount: {
    success: null,
    message: null
  },
  changeMasterName: {
    success: null,
    message: null
  },
  addUserToMaster: {
    success: null,
    message: null
  },
  addUserToDispensary: {
    success: null,
    message: null
  },
  deleteUserFromMaster: {
    success: null,
    message: null
  },
  deleteUserFromDispensary: {
    success: null,
    message: null
  },
  getCustomStrains: {
    success: null,
    message: null,
    strains: []
  },
  addCustomStrain: {
    success: null,
    message: null
  },
  deleteCustomStrain: {
    success: null,
    message: null
  },
  getMasterAccountById: {
    success: null,
    message: null,
    account: null
  },
  getDispensaryAccountById: {
    success: null,
    message: null,
    account: null
  }
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case CHANGE_DISPENSARY_LOGO:
      return { ...state, changeDispensaryLogo: action.payload };
    case CHECK_DISPENSARY_ADDRESS:
      return { ...state, checkDispensaryAddress: action.payload };
    case CHANGE_DISPENSARY_ADDRESS:
      return { ...state, changeDispensaryAddress: action.payload };
    case GET_USERS_BY_ACCOUNT:
      return { ...state, getUsersByAccount: action.payload };
    case GET_CUSTOM_STRAINS:
      return { ...state, getCustomStrains: action.payload };
    case ADD_CUSTOM_STRAIN:
      return { ...state, addCustomStrain: action.payload };
    case DELETE_CUSTOM_STRAIN:
      return { ...state, deleteCustomStrain: action.payload };
    case GET_MASTER_BY_ACCOUNT_ID:
      return { ...state, getMasterAccountById: action.payload };
    case GET_DISPENSARY_ACCOUNT_BY_ID:
      return { ...state, getDispensaryAccountById: action.payload };
    case GET_PENDING_USERS_BY_ACCOUNT:
      return { ...state, getPendingUsersByAccount: action.payload };
    case CREATE_DISPENSARY_ADDRESS:
      return { ...state, createDispensaryAccount: action.payload };
    case DELETE_DISPENSARY_ADDRESS:
      return { ...state, deleteDispensaryAccount: action.payload };
    case CHANGE_MASTER_NAME:
      return { ...state, changeMasterName: action.payload };
    case ADD_USER_TO_MASTER:
      return { ...state, addUserToMaster: action.payload };
    case ADD_USER_TO_DISPENSARY:
      return { ...state, addUserToDispensary: action.payload };
    case DELETE_USER_FROM_MASTER:
      return { ...state, deleteUserFromMaster: action.payload };
    case DELETE_USER_FROM_DISPENSARY:
      return { ...state, deleteUserFromDispensary: action.payload };
    default:
      return state;
  }
};
