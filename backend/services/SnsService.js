const MessageValidator = require("sns-validator");
const newrelic = require("newrelic");
const https = require("https");
const {promisify} = require('util');

class SnsService {
  constructor(_db) {
    this.db = _db;
    this.validator = new MessageValidator();
  }

  async process(headers, body) {
    if (!headers["x-amz-sns-message-type"]) {
      console.log("couldn't find x-amz-sns-message-type");
      return;
    }
    if (!headers["x-amz-sns-topic-arn"]) {
      console.log("couldn't find x-amz-sns-topic-arn");
      return;
    }
    //console.log("headers: ", headers);
    //console.log("body: ", body);

    // we will want to implement a check against the arn TODO

    const validate = promisify(this.validator.validate).bind(this.validator);
    let message;
    try {
      message = await validate(body);
    } catch (err) {
      console.log(err);
      return;
    }
    if (!message) {
      console.log("message was blank");
      return;
    }
    //console.log("message: ", message);
    if (message["Type"] === "SubscriptionConfirmation") {
      httpsGet = promisify(https.get).bind(https);
      let subscriptionResponse;
      try {
        subscriptionResponse = await httpsGet(message["SubscribeURL"]); // we will want to implement a check against the arn TODO
      } catch (err) {
        console.log(err);
      }
      return;
    } else {
      let messageJson;
      try {
        messageJson = JSON.parse(message["Message"]);
      } catch (err) {
        console.log(err);
        return null;
      }
      //console.log("json: ");
      //console.log(messageJson);
      return messageJson;
    }
  }
}

export default SnsService;
