const handler ={}
const { hash } = require('../../helpers/utilities');
const data = require('../../lib/data')
handler.userHandler = (requestProperties, callback)=>{
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if(acceptedMethod.indexOf(requestProperties.method) > -1){
       handler._users[requestProperties.method](requestProperties, callback)
    }else{
        callback(405,{
            message:'This method not allowed'
        })
    }
};
//Handler Request properties
handler._users ={}

//post method
handler._users.post = (requestProperties, callback)=>{
    const firstName = typeof(requestProperties.body.firstName) === "string" && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === "string" && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof(requestProperties.body.phone) === "string" && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === "string" && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === "boolean" ? requestProperties.body.tosAgreement : false;
    //condition check 
    if(firstName && lastName && phone && password && tosAgreement){
        //make sure that the user doesn't already exists
         callback(200,{
             message:'user created condition'
         })
    }else{
        callback(400,{
            error:"your request is bad"
        })
    }
}
handler._users.get = (requestProperties, callback)=>{
    callback(200,{
        message:'wow right now are exits GET method'
    })
}
handler._users.put = (requestProperties, callback)=>{
    callback(200,{
        message:'wow right now are exits PUT method'
    })
}
handler._users.delete = (requestProperties, callback)=>{
    callback(200,{
        message:'wow right now are exits DELETE method'
    })
}

module.exports = handler