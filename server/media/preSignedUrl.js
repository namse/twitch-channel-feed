const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const authenticateExtensionToken = require('../authenticateExtensionToken');

const s3 = new AWS.S3({
  region: 'ap-northeast-2',
});
const MB = 1024 * 1024;

module.exports.get = async (event, context, callback) => {
  const {
    token,
  } = body;
  const decoded = await authenticateExtensionToken(token);
  const {
    role,
  } = decoded;
  if (role !== 'broadcaster') {
    throw new Error('you are not broadcaster. fuck you');
  }

  const params = {
    Bucket: 'twitch-channel-feed-media-before-encode',
    Conditions: [
      ["content-length-range", 0, 40 * MB],
      {
        key: 'image123'
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

  return {
    url,
    fields,
    key: uuid(),
  };
};