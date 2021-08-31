import DB from "../services/DB";
import IpGeo from "../services/IpGeoService";
import BingMaps from "../services/BingMapsService";
import GoogleMaps from "../services/GoogleMapsService";
import DispensaryService from "../services/DispensaryService";
import QuestionService from "../services/QuestionService";
import StrainService from "../services/StrainService";
import Cache from "../services/CacheService";
import AgeVerificationSvc from "../services/AgeVerificationService";
import AccountService from "../services/AccountService";
import UserService from "../services/UserService";
import MailService from "../services/MailService";
import HelpersService from "../services/HelpersService";
import AwsS3Service from "../services/AwsS3Service";
import SnsService from "../services/SnsService";
import AdminService from "../services/AdminService";
import NewRelicApiService from "../services/NewRelicApiService";
const cachettl = 60 * 60 * 24; // cache for 1 day
const cache = new Cache(cachettl);
const db = new DB(cache);
const newrelic = require("newrelic");
const express = require("express");
const router = express.Router();
const helpers = new HelpersService();
const questionSvc = new QuestionService(db, cache);
const ipgeo = new IpGeo(cache);
const bingMaps = new BingMaps(cache);
const googleMaps = new GoogleMaps(cache);
const dispensarySvc = new DispensaryService(db, cache, googleMaps, ipgeo);
const ageVerificationSvc = new AgeVerificationSvc(db);
const awsS3Svc = new AwsS3Service();
const strainSvc = new StrainService(db, cache, awsS3Svc);
const nrApiSvc = new NewRelicApiService();
const accountSvc = new AccountService(db, awsS3Svc, nrApiSvc);
const userSvc = new UserService(db);
const mailSvc = new MailService(db);
const snsSvc = new SnsService();
const adminSvc = new AdminService(db);

const thrivecartSecret = process.env.TC_SECRET_WORD;

const legalStates = [
  {
    name: "Oregon",
    short: "OR"
  },
  {
    name: "California",
    short: "CA"
  },
  {
    name: "Colorado",
    short: "CO"
  },
  {
    name: "Washington",
    short: "WA"
  }
];

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    newrelic.addCustomAttribute("user", req.session.user);
    next();
  } else {
    req.session.destroy();
    res.json({
      success: false,
      message: "Session no longer active."
    });
  }
};

// get question by id
router.get("/get/q/:id", (req, res) => {
  const questionId = req.params.id;
  if (isNaN(questionId)) {
    res.sendStatus(500);
  } else {
    questionSvc.getQuestion(questionId).then(response => {
      newrelic.addCustomAttribute("questionId", response.questionId.toString());
      newrelic.addCustomAttribute("question", response.question);
      res.json(response);
    });
  }
});

/* *************************
get results with dispensary
response shape: 
{
    success: bool,
    message: string,
    strain: models.Strain,
    dispensary: models.Dispensary
}
************************* */
router.post("/get/result", async (req, res) => {
  let { selections, point, zip } = req.body;
  let { ip } = req;
  let response = {},
    dispensary = {};
  const hybridIPCheck = /^:?:(ffff)?:(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
  const isHybrid = hybridIPCheck.test(ip);

  if (isHybrid) {
    ip = ip.replace(/^.*:/, "");
  }
  try {
    newrelic.addCustomAttribute("question1", selections[0].description);
    newrelic.addCustomAttribute("question2", selections[1].description);
    newrelic.addCustomAttribute("question3", selections[2].description);
    newrelic.addCustomAttribute("question4", selections[3].description);
    newrelic.addCustomAttribute("ip", ip);
    newrelic.addCustomAttribute("point", point);
    newrelic.addCustomAttribute("zip", zip);
  } catch (err) {
    console.log(err);
  }

  // console.log("ip: ", ip);
  // console.log("point: ", point);
  // console.log("zip: ", zip);

  if (!point) {
    // console.log("Using IP data");
    const ipData = await ipgeo.get(ip);

    if (!ipData.latitude || !ipData.longitude || !zip) {
      point = ipData.latitude.toString() + "," + ipData.longitude.toString();
      zip = ipData.zip;
      newrelic.addCustomAttribute("dispensaryLocMethodUsed", "ipaddress");
    } else {
      newrelic.addCustomAttribute("ipError", "Unable to determine lat/lng/zip from IP");
      newrelic.addCustomAttribute("dispensaryLocMethodUsed", "random");
      point = null;
      zip = null;
    }
  } else {
    newrelic.addCustomAttribute("dispensaryLocMethodUsed", "html5geo");
  }

  dispensary = await dispensarySvc.getDispensarySuggestion(point, zip);
  response.dispensary = dispensary;
  newrelic.addCustomAttribute("dispensaryAccountId", dispensary.subAccountId);
  newrelic.addCustomAttribute("dispensaryPlaceId", dispensary.place_id);
  newrelic.addCustomAttribute("dispensaryName", dispensary.name);
  newrelic.addCustomAttribute("dispensaryAddress", dispensary.address);

  const strain = await strainSvc.getStrain(selections, dispensary.subAccountId);
  response.strain = strain;
  newrelic.addCustomAttribute("strainName", strain.name);
  newrelic.addCustomAttribute("strainType", strain.type);

  response.success = true;
  response.message = "Operation successful.";

  res.json(response);
});

/* *************************
get dispensary by account
response shape: 
{
    success: bool,
    message: string,
    dispensary: models.Dispensary
}
************************* */
router.post("/get/dispensary/byaccount/:id", (req, res) => {
  let accountId = req.params.id;

  dispensarySvc.getDispensaryByAccountId(accountId).then(response => {
    // console.log(response);
    res.json(response);
  });
});

// get reverse geocoded location
router.post("/get/geo/:point", (req, res) => {
  const point = req.params.point;
  if (point === null) {
    console.error("No point, unable to determine geolocation");
    res.sendStatus(500);
  } else if (point.split(/,/).length !== 2) {
    console.error("point malformed, unable to determine geolocation", point);
    res.sendStatus(500);
  } else {
    bingMaps.fromPoint(point).then(geoData => {
      const stateShort = geoData.data.resourceSets[0].resources[0].address.adminDistrict;
      const stateLong = legalStates.find(s => s.short === stateShort).name;
      const zip = geoData.data.resourceSets[0].resources[0].address.postalCode;
      const isLegal = typeof stateLong !== "undefined";
      newrelic.addCustomAttribute("geoState", stateLong);
      newrelic.addCustomAttribute("geoZip", zip);
      newrelic.addCustomAttribute("isLegal", isLegal.toString());
      const response = {
        state: stateLong,
        zip: zip,
        isLegal: isLegal
      };
      res.json(response);
    });
  }
});

// record age verification data
router.post("/ageverification", (req, res) => {
  const isOver21 = req.body.data.isOver21;
  let ip = req.ip;

  if (ip === null) {
    console.error("IP was null, unable to update age verification db");
  } else {
    const hybridIPCheck = /^:?:(ffff)?:(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
    const isHybrid = hybridIPCheck.test(ip);

    if (isHybrid) {
      ip = ip.replace(/^.*:/, "");
    }

    ipgeo.get(ip).then(ipData => {
      newrelic.addCustomAttribute("over21", isOver21);
      newrelic.addCustomAttribute("ageZip", ipData.zip);

      ageVerificationSvc.add(ip, ipData.zip.toString(), isOver21);
    });
  }

  // always send 200
  res.sendStatus(200);
});

/* *************************
Check provided dispensary address against google
response shape: 
{
    success: bool,
    message: string,
    dispensaryInfo: {
      place_id: string,
      address: string,
      name: string,
      lat: number,
      lng: number
    }
}
************************* */
router.post("/account/dispensary/checkaddress", sessionChecker, (req, res) => {
  const { name, street, city, state, zip } = req.body;
  const incomingAddress = name + " " + street + ", " + city + ", " + state + " " + zip;
  //console.log(incomingAddress);
  googleMaps.placeSearch(incomingAddress).then(results => {
    //  console.log(results);
    res.json(results);
  });
});

/* *************************
Update  dispensary address 
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.post("/account/dispensary/address", sessionChecker, (req, res) => {
  const { accountId, dispensaryInfo } = req.body;
  accountSvc.updateDispensaryAddress(accountId, dispensaryInfo).then(results => {
    // console.log(results);
    res.json(results);
  });
});

/* *************************
login and optionally get user and account data
response shape: 
{
    success: bool,
    message: string,
    user: models.User,
    masterAccount: models.MasterAccount,
    subAccounts: [models.SubAccount]
}
************************* */
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  let { includeAccounts } = req.body;
  if (typeof includeAccounts === "undefined") {
    includeAccounts = false;
  }
  const resp = await userSvc.checkPassword(email, password, includeAccounts);
  if (resp.success) {
    req.session.user = email;
  }

  // console.log(resp);
  res.json(resp);
});

/* *************************
check session, login, get user and  account data
response shape: 
{
    success: bool,
    message: string,
    user: models.User,
    masterAccount: models.MasterAccount,
    subAccounts: [models.SubAccount]
}
************************* */
router.post("/user/checksession", sessionChecker, async (req, res) => {
  const email = req.session.user;
  const resp = await userSvc.getUserDataByEmail(email, true);

  res.json(resp);
});

/* *************************
logout
response: 200
************************* */
router.post("/user/logout", async (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

/* *************************
get user data by email, optionally include accounts
response shape: 
{
    success: bool,
    message: string,
    user: models.User,
    masterAccount: models.MasterAccount,
    subAccounts: [models.SubAccount]
}
************************* */
router.post("/user/get/email=:email&include_accounts=:includeAccunts?", sessionChecker, async (req, res) => {
  const { email, includeAccounts } = req.params;
  const user = await userSvc.getUserDataByEmail(email, includeAccounts);
  res.json(user);
});

/* *************************
get user data by token, includes accounts
response shape: 
{
    success: bool,
    message: string,
    user: models.User,
    masterAccount: models.MasterAccount,
    subAccounts: [models.SubAccount]
}
************************* */
router.post("/user/get/token=:token", async (req, res) => {
  const token = req.params.token;
  const user = await userSvc.getUserDataByToken(token);
  res.json(user);
});

/* *************************
get pending users
response shape: 
{
    success: bool,
    message: string,
    users: [models.User]
}
************************* */
router.post("/user/pending", sessionChecker, async (req, res) => {
  const users = await userSvc.getPendingUsers();
  const response = {
    success: true,
    message: "Get pending users successful.",
    users: users
  };
  res.json(response);
});

/* *************************
resend pending user email
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.post("/user/pending/resend/:id", sessionChecker, async (req, res) => {
  const { id } = req.params;

  const response = await userSvc.getUserDataById(id);
  if (response.success) {
    const { user } = response;
    if (user) {
      if (user.newOwner) {
        mailSvc.sendDispensaryInvite({ email: user.email, token: user.token });
      } else {
        mailSvc.sendNewUser({ email: user.email, token: user.token });
      }
    }
    res.json({ success: true, message: "Successfully resent invitation email." });
  } else {
    res.json({ success: false, message: "An error occurred while resending invitation email." });
  }
});

/* *************************
get pending users by subaccount
response shape: 
{
    success: bool,
    message: string,
    users: [models.User]
}
************************* */
router.post("/account/dispensary/:id/users/pending", sessionChecker, async (req, res) => {
  const { id } = req.params;
  const user = await userSvc.getPendingUsersByAccount(id, false);

  res.json(user);
});

/* *************************
get pending users by masteraccount
response shape: 
{
    success: bool,
    message: string,
    users: [models.User]
}
************************* */
router.post("/account/master/:id/users/pending", sessionChecker, async (req, res) => {
  const { id } = req.params;
  const resp = await userSvc.getPendingUsersByAccount(id, true);
  res.json(resp);
});

/* *************************
get active users by subaccount
response shape: 
{
    success: bool,
    message: string,
    users: [models.User]
}
************************* */
router.post("/account/dispensary/:id/users", sessionChecker, async (req, res) => {
  const { id } = req.params;
  const resp = await userSvc.getActiveUsersByAccount(id, false);
  res.json(resp);
});

/* *************************
get active users by masteraccount
response shape: 
{
    success: bool,
    message: string,
    users: [models.User]
}
************************* */
router.post("/account/master/:id/users", sessionChecker, async (req, res) => {
  const { id } = req.params;
  const resp = await userSvc.getActiveUsersByAccount(id, true);
  res.json(resp);
});

/* *************************
get all master accounts data
response shape: 
{
    success: bool,
    message: string,
    accounts: [models.MasterAccount]
}
************************* */

router.post("/account/master/all", sessionChecker, async (req, res) => {
  let response = await accountSvc.getMasterAccounts();
  res.json(response);
});

/* *************************
get  master account by id
response shape: 
{
    success: bool,
    message: string,
    account: models.MasterAccount
}
************************* */

router.post("/account/master/:id/get", sessionChecker, async (req, res) => {
  const { id } = req.params;
  const resp = await accountSvc.getMasterAccountById(id);

  res.json(resp);
});

/* *************************
get dispensary account by id
response shape: 
{
    success: bool,
    message: string,
    account: models.SubAccount
}
************************* */

router.post("/account/dispensary/:id/get", sessionChecker, async (req, res) => {
  const { id } = req.params;
  const resp = await accountSvc.getDispensaryAccountById(id);

  res.json(resp);
});

/* *************************
create dispensary user
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.post("/user/create/dispensary", sessionChecker, async (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const createUser = await userSvc.createUser(email, name, true, true);
  if (createUser.success) {
    mailSvc.sendDispensaryInvite({ email: email, token: createUser.user.token });
  }

  res.json(createUser);
});

/* *************************
create dispensary user from thrivecart webhook
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.post("/user/create/dispensary/fromtc", async (req, res) => {
  const { thrivecart_secret, customer } = req.body;
  if (thrivecartSecret !== thrivecart_secret) {
    console.log("THRIVECART SECRET DOESN'T MATCH!");
    console.log(`fromEnv: ${thrivecartSecret}`);
    console.log(`fromTC: ${thrivecart_secret}`);
    newrelic.addCustomAttribute("ThriveCartError", "secret mismatch");
  } else {
    console.log(customer);
    const { email, name } = customer;
    const createUser = await userSvc.createUser(email, name, true, true);
    if (createUser.success) {
      mailSvc.sendDispensaryInvite({ email: email, token: createUser.user.token });
    } else {
      console.log(`create user failed! ${createUser.message}`);
      newrelic.addCustomAttribute("CreateUserFailed", createUser.message);
    }
  }

  res.sendStatus(200);
});

/* *************************
create master account
response shape: 
{
    success: bool,
    message: string,
    masterAccount: models.MasterAccount
}
************************* */
router.post("/account/master/create", sessionChecker, async (req, res) => {
  const name = req.body.name;
  const email = req.session.user;
  const createMaster = await accountSvc.createMaster(name, email);
  console.log(createMaster);
  res.json(createMaster);
});

/* *************************
set new user settings
response shape: 
{
  success: bool,
  message: string
}
************************* */
router.post("/user/new/settings", async (req, res) => {
  const { email, name, password, token } = req.body;
  const resp = await userSvc.newUserSettings({ email: email, name: name, password: password, token: token });

  if (resp.success) {
    mailSvc.sendSetPasswordSuccess({ email: email });
    req.session.user = email;
  }

  res.json(resp);
});

/* *************************
set initial password
response shape: 
{
  success: bool,
  message: string
}
************************* */
router.post("/user/set/password", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const token = req.body.token;
  const resp = await userSvc.setPassword(email, password, token);

  if (resp.success) {
    mailSvc.sendSetPasswordSuccess({ email: email });
    req.session.user = email;
  }

  res.json(resp);
});

/* *************************
forgot password
response shape: 
{
  success: bool,
  message: string
}
************************* */
router.post("/user/forgotpassword", async (req, res) => {
  const email = req.body.email;
  const resp = await userSvc.forgotPassword(email);

  if (resp.success) {
    mailSvc.sendForgotPasswordSuccess({ email: email, token: resp.token });
    console.log(resp.token);
    delete resp.token;
  }

  res.json(resp);
});

/* *************************
change password
response shape: 
{
  success: bool,
  message: string
}
************************* */
router.post("/user/change/password", sessionChecker, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const resp = await userSvc.changePassword(email, password);

  if (resp.success) {
    mailSvc.sendChangePasswordSuccess({ email: email });
  }

  res.json(resp);
});

/* *************************
change user settings
response shape: 
{
  success: bool,
  message: string
}
************************* */
router.put("/user/change/settings", sessionChecker, async (req, res) => {
  const newEmail = req.body.email;
  const oldEmail = req.session.user;
  const name = req.body.name;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const resp = await userSvc.updateSettings(oldEmail, newEmail, name, oldPassword, newPassword);

  if (resp.success) {
    mailSvc.sendUpdatedUserSettings({ name: name, email: newEmail });
  }

  res.json(resp);
});

/* *************************
change master name
response shape: 
{
  success: bool,
  message: string
}
************************* */
router.put("/account/master/name", sessionChecker, async (req, res) => {
  const { accountId, name } = req.body;
  newrelic.addCustomAttribute("accountId", accountId);
  const resp = await accountSvc.updateMasterName(accountId, name);

  res.json(resp);
});

/* *************************
upload dispensary logo
response shape: 
{
    success: bool,
    message: string,
    logo: string
}
************************* */
router.put("/account/dispensary/logo", sessionChecker, async (req, res) => {
  const { file } = req.files;
  const { accountId } = req.body;
  newrelic.addCustomAttribute("accountId", accountId);
  const resp = await accountSvc.updateDispensaryLogo(file, accountId);

  res.json(resp);
});

/* *************************
create dispensary account
response shape: 
{
    success: bool,
    message: string
  }
************************* */
router.post("/account/dispensary/create", sessionChecker, async (req, res) => {
  const { masterAccountId, name } = req.body;
  const email = req.session.user;
  newrelic.addCustomAttribute("masterAccountId", masterAccountId);
  const resp = await accountSvc.createDispensaryAccount(masterAccountId, name, email);
  console.log(resp);
  res.json(resp);
});

/* *************************
delete dispensary account
response shape: 
{
    success: bool,
    message: string
  }
************************* */
router.delete("/account/dispensary/:accountId", sessionChecker, async (req, res) => {
  const { accountId } = req.params;
  const email = req.session.user;
  newrelic.addCustomAttribute("accountId", accountId);
  const resp = await accountSvc.deleteDispensaryAccount(accountId);

  res.json(resp);
});

/* *************************
add user to master account
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.post("/account/master/adduser", sessionChecker, async (req, res) => {
  const { accountId, email } = req.body;
  newrelic.addCustomAttribute("accountId", accountId);
  const resp = await accountSvc.addUserToMaster(accountId, email);

  if (resp.success && resp.isNewUser) {
    mailSvc.sendNewUser({ email: email, token: resp.user.token });
    delete resp.user; // don't need to send this back
    delete resp.isNewUser; // don't need to send this back
  }

  res.json(resp);
});

/* *************************
add user to dispensary account
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.post("/account/dispensary/adduser", sessionChecker, async (req, res) => {
  const { accountId, email } = req.body;
  newrelic.addCustomAttribute("accountId", accountId);
  const resp = await accountSvc.addUserToDispensary(accountId, email);

  if (resp.success && resp.isNewUser) {
    mailSvc.sendNewUser({ email: email, token: resp.user.token });
    delete resp.user; // don't need to send this back
    delete resp.isNewUser; // don't need to send this back
  }

  res.json(resp);
});

/* *************************
delete user from master account
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.post("/account/master/deleteuser", sessionChecker, async (req, res) => {
  const { accountId, email } = req.body;
  newrelic.addCustomAttribute("accountId", accountId);
  const resp = await accountSvc.deleteUserFromMaster(accountId, email);

  res.json(resp);
});

/* *************************
delete user from dispensary account
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.post("/account/dispensary/deleteuser", sessionChecker, async (req, res) => {
  const { accountId, email } = req.body;
  newrelic.addCustomAttribute("accountId", accountId);
  const resp = await accountSvc.deleteUserFromDispensary(accountId, email);

  res.json(resp);
});

/* *************************
get custom strains by sub account id
response shape: 
{
    success: bool,
    message: string,
    strains: [model.Strain]
}
************************* */
router.post("/account/dispensary/:id/strains", sessionChecker, async (req, res) => {
  const { id } = req.params;
  newrelic.addCustomAttribute("accountId", id);
  const resp = await strainSvc.getCustomStrains(id);
  //  console.log(resp);
  res.json(resp);
});

/* *************************
add custom strains by sub account id
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.post("/account/dispensary/:id/addstrain", sessionChecker, async (req, res) => {
  let file;
  if (req.files) {
    file = req.files.file;
  }
  const { name, type, description, choices } = req.body;
  const strainInfo = {
    name: name,
    type: type,
    choices: choices.split(","),
    imgSrc: "",
    description: description
  };

  const { id } = req.params;
  newrelic.addCustomAttribute("accountId", id);
  const resp = await strainSvc.addCustomStrain(id, strainInfo, file);
  //console.log(resp);
  res.json(resp);
});

/* *************************
delete custom strains by sub account id
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.delete("/account/dispensary/:accountId/deletestrain/:strainId", sessionChecker, async (req, res) => {
  const { accountId, strainId } = req.params;
  newrelic.addCustomAttribute("accountId", accountId);
  const resp = await strainSvc.deleteCustomStrain(accountId, strainId);
  // console.log(resp);
  res.json(resp);
});

/* *************************
add email to suppression list
response: 200 http code
************************* */
router.post("/fromsns/bouncesandcomplaints", async (req, res) => {
  const { headers, body } = req;
  const notification = await snsSvc.process(headers, body);
  // console.log("notification: ", notification);
  let emailArr = [];
  let reason;
  if (notification) {
    // console.log("checking if bounce or complaint");
    if (notification.notificationType === "Bounce") {
      //console.log("bounce found");
      reason = notification.bounce;
      for (const recip of reason.bouncedRecipients) {
        emailArr.push(recip.emailAddress);
      }
      delete reason.bouncedRecipients;
    } else if (notification.notificationType === "Complaint") {
      // console.log("Complaint found");
      reason = notification.complaint;
      for (const recip of reason.complainedRecipients) {
        emailArr.push(recip.emailAddress);
      }
      delete reason.complainedRecipients;
    } else {
      console.log("Unable to determine type of notification");
    }
    if (emailArr.length > 0) {
      console.log("adding emails to suppression list: ", emailArr);
      await mailSvc.addToSuppressionList(emailArr, reason);
    }
  }
  //console.log("end of fromsns/bouncesandcomplaints has been reached");
  res.sendStatus(200);
});

/* *************************
get suppression list
response shape: 
{
    success: bool,
    message: string,
    suppressionList: [model.SuppressionList]
}
************************* */
router.post("/admin/suppressionlist/get", sessionChecker, async (req, res) => {
  const resp = await adminSvc.getSuppressionList();
  res.json(resp);
});

/* *************************
delete suppression
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.delete("/admin/suppression/:id", sessionChecker, async (req, res) => {
  const { id } = req.params;
  const resp = await adminSvc.deleteSuppression(id);
  res.json(resp);
});

/* *************************
delete user
response shape: 
{
    success: bool,
    message: string
}
************************* */
router.delete("/admin/user/:id", sessionChecker, async (req, res) => {
  const { id } = req.params;
  const resp = await adminSvc.deleteUser(id);
  res.json(resp);
});

/* *************************
send test email
response: 200
************************* */
// router.post("/admin/sendtestemail/:email", async (req, res) => {
//   const { email } = req.params;
//   await mailSvc.sendTestInvite(email);
//   res.sendStatus(200)
// });

module.exports = router;
