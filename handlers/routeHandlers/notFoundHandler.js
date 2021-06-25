const handler ={}
handler.notFoundHandler = (requestProperties, callback)=>{
    // console.log(requestProperties);
    callback(404, {
        message :'Your page is not round 404 '
    })
}
module.exports = handler