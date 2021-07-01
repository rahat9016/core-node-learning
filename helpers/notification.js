//Dependencies 
const https = require('https');
const querystring = require('querystring')
const {twilio} = require('./environments')

//module scaffolding
const notification = {};

notification.sendTwilioSms = (phone, msg, callback)=>{
    
    const userPhone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMsg = typeof(msg) === "string" && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false

    if(userPhone && userMsg){
        //configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg
        }
        const stringifyPayload = querystring.stringify(payload);
        //configure the request details
        const requestDetails = {
            hostname : 'api.twilio.com',
            method: 'POST',
            path:`/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth:`${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }
        const req = https.request(requestDetails, (res)=>{
            //get the status of the sent request
            const status = res.statusCode;
            console.log(res.statusCode);
            if(status === 200 || status === 201){
                callback(false)
            }else{
                callback(`Status code returned ${status}`)
                
            }
        })
        req.on('error',(e)=>{
            callback(e)
        })
        req.write(stringifyPayload);
        req.end()
    }else{
        callback({error: "Given parameters were missing or invalid"})
    }
}

module.exports = notification