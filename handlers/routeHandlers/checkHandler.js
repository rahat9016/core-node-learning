const {
  hash,
  parseJSON,
  createRandomLength,
} = require("../../helpers/utilities");
const data = require("../../lib/data");
const tokenHandler = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environments");
//Scaffolding
const handler = {};
handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "This method not allowed",
    });
  }
};

handler._check = {};

//POST method
handler._check.post = (requestProperties, callback) => {
  // validation input
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  let successCode =
    typeof requestProperties.body.successCode === "object" &&
    requestProperties.body.successCode instanceof Array
      ? requestProperties.body.successCode
      : false;

  let timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;

  if ((protocol, url, method, successCode, timeOutSeconds)) {
    let token =
      typeof requestProperties.headers.token === "string"
        ? requestProperties.headers.token
        : false;
    //lookup the user phone by reading the token
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        let userPhone = parseJSON(tokenData).phone;
        //lookup the user data
        data.read("users", userPhone, (err, userData) => {
          if (!err && userData) {
            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = parseJSON(userData);
                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxChecks) {
                  let checkId = createRandomLength(20);
                  let checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCode,
                    timeOutSeconds,
                  };
                  data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      data.update("users", userPhone, userObject, (err) => {
                        if (!err) {
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: "There was a problem in server side",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "There was a problem in server side",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "User Already reached max check limit",
                  });
                }
              } else {
                callback(403, {
                  error: "Authentication problem",
                });
              }
            });
          } else {
            callback(403, {
              error: "User not found",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication problem",
        });
      }
    });
  } else {
    callback(400, {
      error: "your have a problem in your request",
    });
  }
};
//GET method
handler._check.get = (requestProperties, callback) => {
  let id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        let token =
          typeof requestProperties.headers.token === "string"
            ? requestProperties.headers.token
            : false;
        tokenHandler._token.verify(
          token,
          parseJSON(checkData).userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              callback(200, parseJSON(checkData));
            } else {
              callback(403, {
                error: "Authentication failure",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "You have a problem in your request",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};
//PUT method
handler._check.put = (requestProperties, callback) => {
  let id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  let successCode =
    typeof requestProperties.body.successCode === "object" &&
    requestProperties.body.successCode instanceof Array
      ? requestProperties.body.successCode
      : false;

  let timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;
  if (id) {
    if (protocol || url || method || successCode || timeOutSeconds) {
      data.read("checks", id, (err, checkData) => {
        if (!err && checkData) {
          const checkObject = parseJSON(checkData);
          let token =
            typeof requestProperties.headers.token === "string"
              ? requestProperties.headers.token
              : false;
          tokenHandler._token.verify(
            token,
            checkObject.userPhone,
            (tokenIsValid) => {
              if (tokenIsValid) {
                if (protocol) {
                  checkObject.protocol = protocol;
                }
                if (url) {
                  checkObject.url = url;
                }
                if (method) {
                  checkObject.method = method;
                }
                if (successCode) {
                  checkObject.successCode = successCode;
                }
                if (timeOutSeconds) {
                  checkObject.timeOutSeconds = timeOutSeconds;
                }
                data.update("checks", id, checkObject, (err) => {
                  if (!err) {
                    callback(200, {
                      message: "Check Data updated",
                    });
                  } else {
                    callback(500, {
                      error: "There was a server side Error!",
                    });
                  }
                });
              } else {
                callback(403, {
                  error: "Authentication Error",
                });
              }
            }
          );
        } else {
          callback(500, {
            error: "There was a problem in your server side",
          });
        }
      });
    } else {
      callback(400, {
        error: "You must provide at least on filed to update",
      });
    }
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};
// DELETE method
handler._check.delete = (requestProperties, callback) => {
  let id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        let token =
          typeof requestProperties.headers.token === "string"
            ? requestProperties.headers.token
            : false;
        tokenHandler._token.verify(
          token,
          parseJSON(checkData).userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              data.delete('checks', id, (err)=>{
                if(!err){
                  data.read('users', parseJSON(checkData).userPhone, (err, userData)=>{
                    let userObject = parseJSON(userData);
                    if(!err && userData){
                      let userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : []
                      let checkPosition = userChecks.indexOf(id);
                      if(checkPosition > -1){
                        userChecks.splice(checkPosition, 1)
                        userObject.checks = userChecks
                        data.update('users', userObject.phone, userObject, (err)=>{
                          if(!err){
                            callback(200)
                          }else{
                            callback(500, {
                              error: "The check id you are trying to remove is not found in user!",
                            });
                          }
                        })
                      }else{
                        callback(500, {
                          error: "There was a server side error",
                        });
                      }
                    }else{
                      callback(500, {
                        error: "There was a server side error",
                      });
                    }
                  })
                }else{
                  callback(500, {
                    error: "There was a server side error",
                  });
                }
              })
            } else {
              callback(403, {
                error: "Authentication failure",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "You have a problem in your request",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

module.exports = handler;
