const server = require('./lib/server')
const workers = require('./lib/worker')


const app ={};

app.init = ()=>{
    //start the server 
    server.init()
    
    //start the workers
    workers.init()
}

app.init()

module.exports = app