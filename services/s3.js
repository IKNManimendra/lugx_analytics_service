const AWS = require('aws-sdk');
const path = require('path');

const s3 = new AWS.S3({
    region: process.env.AWS_REGION || 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/**
 * Uploads a file or JSON content to S3.
 * @param {string} key - The path (inside bucket) to save the file.
 * @param {Buffer|string|Object} body - File content or JSON.
 * @param {string} contentType - MIME type (e.g., 'application/json')
 */
async function uploadToS3(key, body, contentType = 'application/json') {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: typeof body === 'object' ? JSON.stringify(body) : body,
        ContentType: contentType,
    };

    return s3.upload(params).promise();
}

module.exports = {
    s3,
    uploadToS3,
};
