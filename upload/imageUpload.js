const storage = require('@google-cloud/storage');
var stream = require('stream');
var uuid = require('node-uuid');

const keyFilename = "./Witty-App-ServiceAccount.json";
const projectId = "witty-app";
const bucketName = 'witty-app.appspot.com';

const gcs = storage({
    projectId: projectId,
    keyFilename: keyFilename
});

const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

exports.uploadToGcs = function(req, wittyObj) {
    return new Promise(function (resolve, reject) {
        var contentType = 'image/jpeg';
        var fileExtention = '.jpg';

        if(wittyObj.image) {
            var dataArray = wittyObj.image.split(",");
            wittyObj.image = dataArray[1];

            var contentTypeArray = dataArray[0].split(":");
            contentType = contentTypeArray[1].split(';')[0];

            var fileExtentionArray = contentType.split("/");
            fileExtention = "." + fileExtentionArray[1];
        }

        const gcsname = uuid.v4() + fileExtention;
        const file = bucket.file(gcsname);

        var bufferStream = new stream.PassThrough();

        bufferStream.pipe(file.createWriteStream({
            metadata: {
                contentType: contentType,
                metadata: {
                    custom: 'metadata'
                }
            },
            public: true,
            validation: "md5"
        }))
            .on('error', function(err) {
                wittyObj.isUploaded = false;
                reject({status: wittyObj});
            })
            .on('finish', function() {
                wittyObj.image = getPublicUrl(gcsname);
                wittyObj.isUploaded = true;
                resolve({status: wittyObj});
            });

        bufferStream.end(new Buffer(wittyObj.image, 'base64'));
    });
};