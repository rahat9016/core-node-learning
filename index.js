const http  = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments')
const {sendTwilioSms} = require('./helpers/notification')
const app ={};
const sms = 'Hi\' Rahat how are you. already you learn Twilio...' 
// sendTwilioSms('01319091017', sms, (err)=>{
//     console.log('error',err)
// })

app.createServer =()=>{
    const server = http.createServer(app.handleReqRes)
    server.listen(environment.port,()=>{
        console.log(`server run in ${environment.port}`);
    })
}
app.handleReqRes = handleReqRes;



app.createServer()