const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    secretKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const fileDelete = async (imagePath) => {
    const filename = imagePath.split('/').pop();
    const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: filename };

    //// callback version ////
    // s3.headObject(params, function (err, data) {
    //     if (err) console.log(err, err.stack);
    //     // error
    //     else {
    //         console.log('file found in S3');
    //         s3.deleteObject(params, function (err, data) {
    //             if (err) console.log(err, err.stack);
    //             // error
    //             else console.log('deleted'); // deleted
    //         });
    //     } // deleted
    // });
    //// callback version ////

    //// promise version ////
    s3.headObject(params)
        .promise()
        .then(
            (data) => {
                console.log('File Found in S3');
                s3.deleteObject(params)
                    .promise()
                    .then(
                        () => console.log('file deleted Successfully'),
                        //prettier-ignore
                        () => console.log('ERROR in file Deleting :' + JSON.stringify(err))
                    );
            },
            (err) => console.log('File not Found ERROR : ' + err.code)
        );
    //// promise version ////

    //// promise version with try catch ////
    // try {
    //     await s3.headObject(params).promise();
    //     console.log('File Found in S3');
    //     try {
    //         await s3.deleteObject(params).promise();
    //         console.log('file deleted Successfully');
    //     } catch (err) {
    //         console.log('ERROR in file Deleting : ' + JSON.stringify(err));
    //     }
    // } catch (err) {
    //     console.log('File not Found ERROR : ' + err.code);
    // }
    //// promise version with try catch ////
};

module.exports = fileDelete;