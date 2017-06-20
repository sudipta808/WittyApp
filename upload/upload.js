const keyFilename = "./Witty-App-ServiceAccount.json";
const projectId = "witty-app";
const bucketName = "";

//const gcs = require('@google-cloud/storage')({
//    projectId,
//    keyFilename
//});
//
//const bucket = gcs.bucket(bucketName);

exports.uploadDocument = function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    setTimeout(function(){
        response.send(JSON.stringify({
            firstName: request.body.firstName || null,
            lastName: request.body.lastName || null
        }));
    }, 1000);
    //response.json({data: request.body});
};