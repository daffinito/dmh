import { combineReducers } from "redux";
import questionData from "./questionReducer";
import choiceData from "./choiceReducer";
import selectionCache from "./selectionReducer";
import results from "./resultReducer";
import ui from "./uiReducer";
import dialData from "./dialReducer";
import dispensaryData from "./dispensaryReducer";
import ageVerificationData from "./ageVerificationReducer";
import geoLocData from "./geoLocationReducer";
import userData from "./userReducer";
import authData from "./authenticationReducer";
import adminData from "./adminReducer";
import accountData from "./accountReducer";
import termsOfUseData from "./termsOfUseReducer"

const rootReducer = combineReducers({
  questionData,
  choiceData,
  selectionCache,
  results,
  ui,
  dialData,
  dispensaryData,
  ageVerificationData,
  geoLocData,
  userData,
  authData,
  adminData,
  accountData,
  termsOfUseData
});

export default rootReducer;
