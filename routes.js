const {sampleHandler} = require("./handlers/routeHandlers/samplehandler");
const {userHandler} = require("./handlers/routeHandlers/userHandler");

const routes ={
    'sample' : sampleHandler,
    'user' : userHandler
}

module.exports = routes