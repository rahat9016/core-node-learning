//dependencies
const {
  hash,
  parseJSON,
  createRandomLength,
} = require("../../helpers/utilities");
const data = require("../../lib/data");

//module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

//POST
handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11 ?
    requestProperties.body.phone :
    false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0 ?
    requestProperties.body.password :
    false;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      const hashPassword = hash(password);
      if (hashPassword === parseJSON(userData).password) {
        let tokenId = createRandomLength(20);
        let expires = Date.now() + 60 * 60 * 1000;
        const tokenObject = {
          phone,
          id: tokenId,
          expires,
        };
        //store the token in database
        data.create("tokens", tokenId, tokenObject, (err) => {
          if (!err) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "There was a server side problem",
            });
          }
        });
      } else {
        callback(400, {
          error: "Password is not valid",
        });
      }
    });
  } else {
    callback(400, {
      error: "your have a problem in your request",
    });
  }
};
//GET
handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20 ?
    requestProperties.queryStringObject.id :
    false;
  if (id) {
    data.read("tokens", id, (err, userToken) => {
      const token = {
        ...parseJSON(userToken)
      };
      if ((!err, token)) {
        callback(200, token);
      } else {
        callback(404, {
          Error: "Requested token was not found",
        });
      }
    });
  } else {
    callback(404, {
      Error: "Requested token was not found",
    });
  }
};
//PUT
handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20 ?
    requestProperties.body.id :
    false;
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true ?
    true :
    false;
 
  if (id && extend) {
    data.read("tokens", id, (err, tokenData) => {
      
      let tokenObject = parseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 60;
        data.update('tokens', id, tokenObject, (err) => {
          if (!err) {
            callback(200, {
              message: 'Token updated Successfully done!'
            })
          } else {
            callback(500, {
              error: 'There was a server side Error'
            })
          }
        })
      } else {
        callback(400, {
          error: "Token already Expires",
        });
      }
    });
  } else {
    callback(400, {
      error: "your have a problem in your request",
    });
  }
};
handler._token.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, {
              message: "Token deleted Successfully",
            });
          } else {
            callback(500, {
              error: "There was a server side problem",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a server side problem",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request",
    });
  }
};

handler._token.verify = (id, phone, callback)=>{
  data.read('tokens', id, (err, tokenData)=>{
    if(!err && tokenData){
      if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()){
        callback(true,{
          message:'ok'
        })
      }else{
        callback(false)
      }
    }
    else{
      callback(false)
    }
  })
}


module.exports = handler;