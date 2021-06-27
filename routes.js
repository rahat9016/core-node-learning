const {sampleHandler} = require("./handlers/routeHandlers/samplehandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const {userHandler} = require("./handlers/routeHandlers/userHandler");


const routes ={
    'sample' : sampleHandler,
    'user' : userHandler,
    'token': tokenHandler
}

module.exports = routes