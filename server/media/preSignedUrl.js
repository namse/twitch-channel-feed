const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const authExtTokenHeader = require('../authExtTokenHeader');

const s3 = new AWS.S3({
  region: 'ap-northeast-2',
});
const MB = 1024 * 1024;

module.exports.get = async (event, context, callback) => {
  try {
    const decoded = await authExtTokenHeader(event.headers);
    const {
      role,
      user_id: userId,
    } = decoded;
    if (role !== 'broadcaster') {
      throw new Error('you are not broadcaster. fuck you');
    }

    const mediaId = uuid();
    const key = `${userId}/${mediaId}`;

    const params = {
      Bucket: 'twitch-channel-feed-media-before-encode',
      Conditions: [
        ["content-length-range", 0, 40 * MB],
        {
          key,
        },
      ],
    };

    const data = await new Promise((resolve, reject) => {
      s3.createPresignedPost(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });

    const {
      url,
      fields,
    } = data;

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        url,
        fields,
        key,
        mediaId,
      }),
    };
    callback(null, response);
  } catch (err) {
    const response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(err, Object.getOwnPropertyNames(err)),
    };
    callback(null, response);
  }
};