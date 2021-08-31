const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
const newrelic = require("newrelic");

class MailService {
  constructor(_db) {
    this.db = _db;
    this.transporter = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: "2010-12-01"
      })
    });
  }

  /*sendTestInvite(email) {
    this.transporter.sendMail(
      {
        from: "support@dialmyhigh.com",
        to: email,
        subject: "Welcome to DialMyHigh!",
        text:
          "Thank you for signing up with DialMyHigh! We need to verify your email address to continue. Please click the following link or copy it and paste it in your browser: \n\n\
        https://www.dialmyhigh.com/signup/dispensary/thiswasatest" +
          "\n\n" +
          "If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible." +
          "\n\n" +
          "Sincerely," +
          "\n\n" +
          "The DialMyHigh support team",
        html: `<html>
        <body style="margin: 0px; -webkit-text-size-adjust:none;" yahoo="fix">
        <style type="text/css">
          html,
          body {
            font-family: Arial, Helvetica, sans-serif;
          }
        </style>
        <div style="margin: 10px auto; padding: 20px; width: 70%; border: 1px solid gray">
          <img src="https://dialmyhigh.s3-us-west-2.amazonaws.com/images/email/dmh-logo-orange.png" width="235" height="100%" style="display: inline-block;" alt="DialMyHigh logo">
          <h2>Thank you for signing up with DialMyHigh!</h2></img>
        <p>We need to verify your email address to continue. Please click the following link or copy it and paste it in your browser to continue:</p>
        <div style="text-align: center;">
          <div style="padding: 10px; text-align: center; display: inline-block; border: 1px solid lightgray">
            <a href='https://www.dialmyhigh.com/signup/dispensary/thiswasates'>https://www.dialmyhigh.com/signup/dispensary/thiswasates</a>
          </div>
        </div>
        <p>If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible.</p>
        <br />
        <p>Sincerely,</p>
        <p>The DialMyHigh support team</p>
      
        </div>
        </body>
       </html>`
      },
      (err, info) => {
        newrelic.addCustomAttribute("Recipient", email);
        newrelic.addCustomAttribute("emailType", "TEST INVITE");
        if (err !== null) {
          console.log(err);
          newrelic.addCustomAttribute("SendSuccessful", "false");
          newrelic.addCustomAttribute("ErrorReceived", err.message);
        } else {
          newrelic.addCustomAttribute("SendSuccessful", "true");
        }
      }
    );
  }*/

  sendDispensaryInvite(emailAndTokenObj) {
    const { email, token } = emailAndTokenObj;
    // send some mail
    this.transporter.sendMail(
      {
        from: "support@dialmyhigh.com",
        to: email,
        subject: "Welcome to DialMyHigh",
        text:
          "Thank you for signing up with DialMyHigh! We need to verify your email address to continue. Please click the following link or copy it and paste it in your browser: \n\n\
        https://www.dialmyhigh.com/signup/dispensary/" +
          token +
          "\n\n" +
          "If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible." +
          "\n\n" +
          "Sincerely," +
          "\n\n" +
          "The DialMyHigh support team",
        html: `<html>
          <body style="margin: 0px; -webkit-text-size-adjust:none;" yahoo="fix">
          <style type="text/css">
            html,
            body {
              font-family: Arial, Helvetica, sans-serif;
            }
          </style>
          <div style="margin: 10px auto; padding: 20px; width: 70%; border: 1px solid gray">
            <img src="https://dialmyhigh.s3-us-west-2.amazonaws.com/images/email/dmh-logo-orange.png" width="235" height="100%" style="display: inline-block;" alt="DialMyHigh logo">
            <h2>Thank you for signing up with DialMyHigh!</h2></img>
          <p>We need to verify your email address to continue. Please click the following link or copy it and paste it in your browser to continue:</p>
          <div style="text-align: center;">
            <div style="padding: 10px; text-align: center; display: inline-block; border: 1px solid lightgray">
              <a href='https://www.dialmyhigh.com/signup/dispensary/${token}'>https://www.dialmyhigh.com/signup/dispensary/${token}</a>
            </div>
          </div>
          <p>If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible.</p>
          <br />
          <p>Sincerely,</p>
          <p>The DialMyHigh support team</p>
        
          </div>
          </body>
         </html>`
      },
      (err, info) => {
        newrelic.addCustomAttribute("Recipient", email);
        newrelic.addCustomAttribute("emailType", "Dispensary Invite");
        if (err !== null) {
          console.log(err);
          newrelic.addCustomAttribute("SendSuccessful", "false");
          newrelic.addCustomAttribute("ErrorReceived", err.message);
        } else {
          newrelic.addCustomAttribute("SendSuccessful", "true");
        }
      }
    );
  }

  sendNewUser(emailAndTokenObj) {
    const { email, token } = emailAndTokenObj;
    // send some mail
    this.transporter.sendMail(
      {
        from: "support@dialmyhigh.com",
        to: email,
        subject: "Welcome to DialMyHigh",
        text:
          "You have been added to a DialMyHigh Dispensary account! We need to verify your email address to continue. Please click the following link or copy it and paste it in your browser: \n\n\
        https://www.dialmyhigh.com/signup/" +
          token +
          "\n\n" +
          "If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible." +
          "\n\n" +
          "Sincerely," +
          "\n\n" +
          "The DialMyHigh support team",
        html: `<html>
          <body style="margin: 0px; -webkit-text-size-adjust:none;" yahoo="fix">
          <style type="text/css">
            html,
            body {
              font-family: Arial, Helvetica, sans-serif;
            }
          </style>
          <div style="margin: 10px auto; padding: 20px; width: 70%; border: 1px solid gray">
            <img src="https://dialmyhigh.s3-us-west-2.amazonaws.com/images/email/dmh-logo-orange.png" width="235" height="100%" style="display: inline-block;" alt="DialMyHigh logo">
            <h2>You have been added to a DialMyHigh Dispensary account!</h2></img>
          <p>We need to verify your email address to continue. Please click the following link or copy it and paste it in your browser to continue:</p>
          <div style="text-align: center;">
            <div style="padding: 10px; text-align: center; display: inline-block; border: 1px solid lightgray">
              <a href='https://www.dialmyhigh.com/signup/${token}'>https://www.dialmyhigh.com/signup/${token}</a>
            </div>
          </div>
          <p>If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible.</p>
          <br />
          <p>Sincerely,</p>
          <p>The DialMyHigh support team</p>
        
          </div>
          </body>
         </html>`
      },
      (err, info) => {
        newrelic.addCustomAttribute("Recipient", email);
        newrelic.addCustomAttribute("emailType", "New User");
        if (err !== null) {
          console.log(err);
          newrelic.addCustomAttribute("SendSuccessful", "false");
          newrelic.addCustomAttribute("ErrorReceived", err.message);
        } else {
          newrelic.addCustomAttribute("SendSuccessful", "true");
        }
      }
    );
  }

  sendForgotPasswordSuccess(emailAndTokenObj) {
    const { email, token } = emailAndTokenObj;
    // send some mail
    this.transporter.sendMail(
      {
        from: "support@dialmyhigh.com",
        to: email,
        subject: "Forgot password link requested",
        text:
          "Here is your forgot password link. Please follow the link or copy it and paste it in your browser: \n\n\
        https://www.dialmyhigh.com/forgotpassword/" +
          token +
          "\n\n" +
          "If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible." +
          "\n\n" +
          "Sincerely," +
          "\n\n" +
          "The DialMyHigh support team",
        html: `<html>
          <body style="margin: 0px; -webkit-text-size-adjust:none;" yahoo="fix">
          <style type="text/css">
            html,
            body {
              font-family: Arial, Helvetica, sans-serif;
            }
          </style>
          <div style="margin: 10px auto; padding: 20px; width: 70%; border: 1px solid gray">
            <img src="https://dialmyhigh.s3-us-west-2.amazonaws.com/images/email/dmh-logo-orange.png" width="235" height="100%" style="display: inline-block;" alt="DialMyHigh logo">
            <h2>Here is your forgot password link!</h2></img>
          <p>Please click the following link or copy it and paste it in your browser to continue:</p>
          <div style="text-align: center;">
            <div style="padding: 10px; text-align: center; display: inline-block; border: 1px solid lightgray">
              <a href='https://www.dialmyhigh.com/forgotpassword/${token}'>https://www.dialmyhigh.com/forgotpassword/${token}</a>
            </div>
          </div>
          <p>If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible.</p>
          <br />
          <p>Sincerely,</p>
          <p>The DialMyHigh support team</p>
        
          </div>
          </body>
         </html>`
      },
      (err, info) => {
        newrelic.addCustomAttribute("Recipient", email);
        newrelic.addCustomAttribute("emailType", "Forgot Password");
        if (err !== null) {
          console.log(err);
          newrelic.addCustomAttribute("SendSuccessful", "false");
          newrelic.addCustomAttribute("ErrorReceived", err.message);
        } else {
          newrelic.addCustomAttribute("SendSuccessful", "true");
        }
      }
    );
  }

  sendChangePasswordSuccess(emailObj) {
    const { email } = emailObj;
    this.transporter.sendMail(
      {
        from: "support@dialmyhigh.com",
        to: email,
        subject: "Password changed",
        text:
          "Your DialMyHigh password has been successfully changed." +
          "\n\n" +
          "If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible." +
          "\n\n" +
          "Sincerely," +
          "\n\n" +
          "The DialMyHigh support team",
        html: `<html>
        <body style="margin: 0px; -webkit-text-size-adjust:none;" yahoo="fix">
        <style type="text/css">
          html,
          body {
            font-family: Arial, Helvetica, sans-serif;
          }
        </style>
        <div style="margin: 10px auto; padding: 20px; width: 70%; border: 1px solid gray">
          <img src="https://dialmyhigh.s3-us-west-2.amazonaws.com/images/email/dmh-logo-orange.png" width="235" height="100%" style="display: inline-block;" alt="DialMyHigh logo">
          <h2>Your DialMyHigh password has been successfully changed.</h2></img>
        <p>If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible.</p>
        <br />
        <p>Sincerely,</p>
        <p>The DialMyHigh support team</p>
      
        </div>
        </body>
       </html>`
      },
      (err, info) => {
        newrelic.addCustomAttribute("Recipient", email);
        newrelic.addCustomAttribute("emailType", "Change Password");
        if (err !== null) {
          console.log(err);
          newrelic.addCustomAttribute("SendSuccessful", "false");
          newrelic.addCustomAttribute("ErrorReceived", err.message);
        } else {
          newrelic.addCustomAttribute("SendSuccessful", "true");
        }
      }
    );
  }

  sendSetPasswordSuccess(emailObj) {
    const { email } = emailObj;
    this.transporter.sendMail(
      {
        from: "support@dialmyhigh.com",
        to: email,
        subject: "Password set",
        text:
          "Your DialMyHigh password has been successfully set." +
          "\n\n" +
          "If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible." +
          "\n\n" +
          "Sincerely," +
          "\n\n" +
          "The DialMyHigh support team",
        html: `<html>
        <body style="margin: 0px; -webkit-text-size-adjust:none;" yahoo="fix">
        <style type="text/css">
          html,
          body {
            font-family: Arial, Helvetica, sans-serif;
          }
        </style>
        <div style="margin: 10px auto; padding: 20px; width: 70%; border: 1px solid gray">
          <img src="https://dialmyhigh.s3-us-west-2.amazonaws.com/images/email/dmh-logo-orange.png" width="235" height="100%" style="display: inline-block;" alt="DialMyHigh logo">
          <h2>Your DialMyHigh password has been successfully set.</h2></img>
        <p>If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible.</p>
        <br />
        <p>Sincerely,</p>
        <p>The DialMyHigh support team</p>
      
        </div>
        </body>
       </html>`
      },
      (err, info) => {
        newrelic.addCustomAttribute("Recipient", email);
        newrelic.addCustomAttribute("emailType", "Set Password");
        if (err !== null) {
          console.log(err);
          newrelic.addCustomAttribute("SendSuccessful", "false");
          newrelic.addCustomAttribute("ErrorReceived", err.message);
        } else {
          newrelic.addCustomAttribute("SendSuccessful", "true");
        }
      }
    );
  }

  sendUpdatedUserSettings(emailAndNameObj) {
    const { email, name } = emailAndNameObj;
    this.transporter.sendMail(
      {
        from: "support@dialmyhigh.com",
        to: email,
        subject: "Updated user settings",
        text:
          "Your DialMyHigh user settings have been successfully updated." +
          "\n\n" +
          "If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible." +
          "\n\n" +
          "Sincerely," +
          "\n\n" +
          "The DialMyHigh support team",
        html: `<html>
        <body style="margin: 0px; -webkit-text-size-adjust:none;" yahoo="fix">
        <style type="text/css">
          html,
          body {
            font-family: Arial, Helvetica, sans-serif;
          }
        </style>
        <div style="margin: 10px auto; padding: 20px; width: 70%; border: 1px solid gray">
          <img src="https://dialmyhigh.s3-us-west-2.amazonaws.com/images/email/dmh-logo-orange.png" width="235" height="100%" style="display: inline-block;" alt="DialMyHigh logo">
          <h2>Your DialMyHigh user settings have been successfully updated.</h2></img>
        <p>If you encounter any issues, please reply to this email with a detailed description of the issue you encountered, and a member of our support team will assist you as soon as possible.</p>
        <br />
        <p>Sincerely,</p>
        <p>The DialMyHigh support team</p>
      
        </div>
        </body>
       </html>`
      },
      (err, info) => {
        newrelic.addCustomAttribute("Recipient", email);
        newrelic.addCustomAttribute("emailType", "Update User Settings");
        if (err !== null) {
          console.log(err);
          newrelic.addCustomAttribute("SendSuccessful", "false");
          newrelic.addCustomAttribute("ErrorReceived", err.message);
        } else {
          newrelic.addCustomAttribute("SendSuccessful", "true");
        }
      }
    );
  }

  async addToSuppressionList(emails, reason) {
    if (0 >= emails.length) {
      return;
    }
    for (const email of emails) {
      const resp = await this.db.addToSuppressionList(email, reason);
      if (!resp.success) {
        console.log(`Error occurred while adding ${email} to the suppression list`);
      }
    }
  }
}

async function checkSuppressionList(emailObj) {
  const { email } = emailObj;
  const dbResp = await this.db.checkSuppressionList(email);
  //console.log("dbResp: ", dbResp);
  if (dbResp) {
    newrelic.addCustomAttribute("EmailSuppressed", "true");
    newrelic.addCustomAttribute("SuppressionReason", dbResp.reason);
    newrelic.addCustomAttribute("Recipient", email);
    return true;
  }
  newrelic.addCustomAttribute("EmailSuppressed", "false");
  return false;
}

for (const key of Object.getOwnPropertyNames(MailService.prototype)) {
  const old = MailService.prototype[key];
  MailService.prototype[key] = async function(...args) {
    checkSuppressionList = checkSuppressionList.bind(this);
    const suppressed = await checkSuppressionList(...args);
    if (!suppressed) {
      old.call(this, ...args);
    } else {
      console.log("EMAIL SUPPRESSED!! ", ...args);
    }
  };
}

export default MailService;
