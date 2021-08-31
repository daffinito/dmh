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
  FORGOT_PASSWORD,
  SET_NEW_USER_PREFS,
  RESEND_PENDING_EMAIL
} from "../actions/types";

const DEFAULT_STATE = {
  fullLogin: {
    success: null,
    message: null
  },
  getUser: {
    success: null,
    message: null
  },
  getUserWithAccounts: {
    success: null,
    message: null
  },
  changePassword: {
    success: null,
    message: null
  },
  setPassword: {
    success: null,
    message: null
  },
  forgotPassword: {
    success: null,
    message: null
  },
  updateUserSettings: {
    success: null,
    message: null
  },
  setNewUserPrefs: {
    success: null,
    message: null
  },
  resendPendingEmail: {
    success: null,
    message: null
  },
  user: {
    id: 0,
    email: "",
    name: "",
    type: "",
    pending: false,
    token: "",
    tokenExpiration: null
  },
  masterAccount: null,
  subAccounts: null
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        getUser: {
          success: action.payload.success,
          message: action.payload.message
        },
        user: action.payload.user
      };

    case GET_USER_BY_TOKEN:
      return {
        ...state,
        getUser: {
          success: action.payload.success,
          message: action.payload.message
        },
        user: action.payload.user,
        masterAccount: action.payload.masterAccount,
        subAccounts: action.payload.subAccounts
      };

    case GET_USER_WITH_ACCOUNTS:
      return {
        ...state,
        getUserWithAccounts: {
          success: action.payload.success,
          message: action.payload.message
        },
        user: action.payload.user,
        masterAccount: action.payload.masterAccount,
        subAccounts: action.payload.subAccounts
      };

    case FULL_LOGIN:
      return {
        ...state,
        fullLogin: {
          success: action.payload.success,
          message: action.payload.message
        },
        user: action.payload.user,
        masterAccount: action.payload.masterAccount,
        subAccounts: action.payload.subAccounts
      };

    case CHANGE_PASSWORD:
      return {
        ...state,
        changePassword: {
          success: action.payload.success,
          message: action.payload.message
        }
      };

    case SET_PASSWORD:
      return {
        ...state,
        setPassword: {
          success: action.payload.success,
          message: action.payload.message
        }
      };

    case FORGOT_PASSWORD:
      return {
        ...state,
        forgotPassword: {
          success: action.payload.success,
          message: action.payload.message
        }
      };

    case UPDATE_USER_SETTINGS:
      return {
        ...state,
        updateUserSettings: {
          success: action.payload.success,
          message: action.payload.message
        }
      };

    case SET_NEW_USER_PREFS:
      return {
        ...state,
        setNewUserPrefs: {
          success: action.payload.success,
          message: action.payload.message
        }
      };

    case LOGOUT:
      return DEFAULT_STATE;

    case CHECK_SESSION:
      return {
        ...state,
        fullLogin: {
          success: action.payload.success,
          message: action.payload.message
        },
        user: action.payload.user,
        masterAccount: action.payload.masterAccount,
        subAccounts: action.payload.subAccounts
      };

    case RESEND_PENDING_EMAIL:
      return {
        ...state,
        resendPendingEmail: action.payload
      };

    default:
      return state;
  }
};
