
var imageUpload = require("./imageUpload.js");

exports.uploadDocument = function (request, response, db) {
    response.setHeader('Content-Type', 'application/json');

    var wittyDataSourceRef = db.ref("wittyDataSource");
    wittyDataSourceRef.once('value', function (snapshot) {
        var wittyObjRef = wittyDataSourceRef.child("wittyList");
        createWittyObject(request.body.wittyDataSource, wittyObjRef, request, response).then(function (resp) {
            if(resp.isUploaded) {
                response.status(200).send({message: "uploaded"});
            }
            else {
                response.status(500).send({message: "Upload fail"});
            }
        })
    });
};

var createWittyObject = function (data, ref, req) {

    return new Promise(function (resolve, reject) {
        var count = 0;
        data.wittyList.forEach(function (witty) {
            imageUpload.uploadToGcs(req, witty).then(function (response, error) {
                if(response) {
                    count++;
                    var wittyObj = {
                        categoryId: response.status.categoryId,
                        image: response.status.image,
                        message: response.status.message,
                        likes: response.status.likes
                    };

                    ref.push(wittyObj);

                    if(data.wittyList.length === count) {
                        resolve({isUploaded: true});
                    }
                }
                else
                    reject({isUploaded: false});
            });
        });
    });
};