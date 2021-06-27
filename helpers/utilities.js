const utilities = {};
const crypto = require("crypto");
const environment = require("./environments");
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }
  return output;
};
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environment.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};
utilities.createRandomLength = (strLength) => {
  let length = strLength;
  length = typeof strLength === "number" && strLength > 0 ? strLength : false;
  if (length) {
    let possibleCharter = "abcdefijklmnopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 0; i < length; i += 1) {
      const randomCharter = possibleCharter.charAt(
        Math.floor(Math.random() * possibleCharter.length)
      );
      output += randomCharter;
    }
    return output;
  } else {
    return false;
  }
};
module.exports = utilities;
