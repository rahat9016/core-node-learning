const http  = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments')
const data = require('./lib/data')
const app ={};
//Create 
// data.create('test', 'newFile',  {name:'bangladesh', language: 'Bangla',},(err)=>{
//     console.log('error was', err);
// })
//Read data
// data.read('test', 'newFile',(err,data)=>{
//     console.log(err,data);
// })
// data.update('test', 'newFile',{name:'Minhajur Rohoman',work:'Web developer', language: 'Bangla',}, (err,data)=>{
//     console.log(err);
// })
// data.delete('test', 'newFile',(err)=>{
//     console.log(err);
// })
app.createServer =()=>{
    const server = http.createServer(app.handleReqRes)
    server.listen(environment.port,()=>{
        console.log(`server run in ${environment.port}`);
    })
}
app.handleReqRes = handleReqRes;


app.createServer()