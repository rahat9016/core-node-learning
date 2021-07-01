const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: 'howareyou',
  maxChecks: 5,
  twilio:{
    fromPhone: '+17753777295',
    accountSid: 'ACe7297e1f3ab1fb74dddf2059a1e10886',
    authToken: 'd56419cd92bbd6d332eba37452246532'
  }
};
environments.production = {
  port: 5000,
  envName: "production",
  secretKey: 'doyouhackme',
  maxChecks: 5,
  twilio:{
    fromPhone: '+12399208151',
    accountSid: 'ACb515efff7d0da0ea037c07e81d68bc1b',
    authToken: '00fb0d72fe7c8076378aa4ddc731e152'
  }
};
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;


module.exports = environmentToExport