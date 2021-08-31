import AWS from "aws-sdk";
import uuid from "uuid/v1";

class AwsS3Service {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    this.s3Bucket = process.env.AWS_S3_BUCKET;
  }

  async uploadDispensaryLogo(file, accountId) {
    const path = "images/account/" + accountId;
    const filetype = file.name.split(".").pop();
    const mimetype = filetype === "png" ? "image/png" : "image/jpeg";
    const key = path + "/" + uuid() + "." + filetype;
    const params = {
      Bucket: this.s3Bucket,
      Key: key,
      Body: file.data,
      ACL: "public-read",
      ContentType: mimetype
    };
    let s3Resp;
    try {
      s3Resp = await this.s3.upload(params).promise();
    } catch (s3Err) {
      return { success: false, message: "Error uploading to S3." };
    }
    return { success: true, message: "Success.", logo: s3Resp.Location };
  }

  async uploadStrainImage(accountId, file) {
    const path = "images/account/" + accountId + "/custom_strains";
    const filetype = file.name.split(".").pop();
    const mimetype = filetype === "png" ? "image/png" : "image/jpeg";
    const key = path + "/" + uuid() + "." + filetype;
    const params = {
      Bucket: this.s3Bucket,
      Key: key,
      Body: file.data,
      ACL: "public-read",
      ContentType: mimetype
    };
    let s3Resp;
    try {
      s3Resp = await this.s3.upload(params).promise();
    } catch (s3Err) {
      return { success: false, message: "Error uploading to S3." };
    }
    return { success: true, message: "Success.", imgSrc: s3Resp.Location };
  }
}

export default AwsS3Service;
