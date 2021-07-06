const http  = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments')
const server ={};

server.config = {
    port: 3000
}
server.createServer =()=>{
    const createServerVariable = http.createServer(server.handleReqRes)
    createServerVariable.listen(server.config.port,()=>{
        console.log(`server run in ${server.config.port}`);
    })
}
server.handleReqRes = handleReqRes;



server.init = ()=>{
    server.createServer()
}

module.exports = server
