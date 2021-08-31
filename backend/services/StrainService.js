class StrainService {
  constructor(_db, _cache, _awsS3Svc) {
    this.cache = _cache;
    this.awsS3Svc = _awsS3Svc;
    this.db = _db;
  }

  getStrain(selections, subAccountId) {
    let selectionsArr = [];
    for (let selection of selections) {
      selectionsArr.push(+selection.choiceId);
    }
    const cacheKey = `strain_${selectionsArr.join()}_${subAccountId}`;

    return this.cache.get(cacheKey, () =>
      Promise.resolve(this.db.getStrains(selectionsArr, subAccountId)).then(strainsFound => {
        return strainsFound[0];
      })
    );
  }

  async getCustomStrains(accountId) {
    const resp = await this.db.getCustomStrains(accountId);
    return resp;
  }

  async addCustomStrain(accountId, strainInfo, image) {
    const defaultImgSrc = "/images/cannabis.jpg"; // left off here, confirm if image was provided
    let s3Resp;
    if (image) {
      s3Resp = await this.awsS3Svc.uploadStrainImage(accountId, image);
      if (!s3Resp.success) {
        console.log(s3Resp);
        return { success: false, message: "Image upload failed." };
      }
    }
    const imgSrc = s3Resp ? s3Resp.imgSrc : defaultImgSrc;
    strainInfo.imgSrc = imgSrc;
    const addStrainResp = await this.db.addCustomStrain(accountId, strainInfo);
    if (!addStrainResp.success) {
      console.log(addStrainResp);
      return { success: false, message: "DB Update failed." };
    }
    return addStrainResp;
  }

  async deleteCustomStrain(accountId, strainId) {
    const resp = await this.db.deleteCustomStrain(accountId, strainId);
    return resp;
  }
}

export default StrainService;
