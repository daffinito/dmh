import {
  GET_MASTER_ACCOUNTS,
  GET_PENDING_USERS,
  CREATE_USER,
  CREATE_MASTER_ACCOUNT,
  GET_SUPPRESSION_LIST,
  DELETE_SUPPRESSION,
  ADMIN_GET_USER,
  ADMIN_DELETE_USER
} from "../actions/types";

const DEFAULT_STATE = {
  createUser: {
    email: "",
    success: true,
    message: ""
  },
  getMasterAccounts: {
    success: true,
    message: "",
    accounts: []
  },
  getPendingUsers: {
    success: true,
    message: "",
    users: []
  },
  createMasterAccount: {
    success: null,
    message: null,
    masterAccount: null
  },
  getSuppressionList: {
    success: null,
    message: null,
    suppressionList: []
  },
  deleteSuppression: {
    success: null,
    message: null
  },
  adminGetUser: {
    success: null,
    message: null,
    user: null
  },
  adminDeleteUser: {
    success: null,
    message: null
  }
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_MASTER_ACCOUNTS:
      return { ...state, getMasterAccounts: action.payload };
    case GET_PENDING_USERS:
      return { ...state, getPendingUsers: action.payload };
    case CREATE_USER:
      return { ...state, createUser: action.payload };
    case CREATE_MASTER_ACCOUNT:
      return { ...state, createMasterAccount: action.payload };
    case GET_SUPPRESSION_LIST:
      return { ...state, getSuppressionList: action.payload };
    case DELETE_SUPPRESSION:
      return { ...state, deleteSuppression: action.payload };
    case ADMIN_GET_USER:
      return { ...state, adminGetUser: action.payload };
    case ADMIN_DELETE_USER:
      return { ...state, adminDeleteUser: action.payload };
    default:
      return state;
  }
};
