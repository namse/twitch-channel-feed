const AWS = require('aws-sdk');
const authExtTokenHeader = require('./authExtTokenHeader');

const s3 = new AWS.S3();
const bucketName = 'twitch-channel-feed';

module.exports.post = async (event, context, callback) => {
  try {
    const body = JSON.parse(event.body);
    const {
      content,
    } = body;

    const MAX_WIDTH = 500;
    const MAX_HEIGHT = 1000;
    const BASE64_BYTE_RATE = 8 / 6;
    const MAX_CONTENT_LENGTH = MAX_WIDTH * MAX_HEIGHT * BASE64_BYTE_RATE;

    if (content.length > MAX_CONTENT_LENGTH) {
      throw new Error(`Too big content: ${content.length}`);
    }

    const decoded = await authExtTokenHeader(event.headers);
    const {
      role,
      user_id: userId,
    } = decoded;
    if (role !== 'broadcaster') {
      throw new Error('you are not broadcaster. fuck you');
    }
    const recentKey = `${userId}/recent.json`;

    let recent
    try {
      const data = await s3.getObject({
        Bucket: bucketName,
        Key: recentKey,
      }).promise();
      recent = JSON.parse(data.Body);
    } catch (err) {
      if (err.code !== 'NoSuchKey') {
        throw err;
      }
      recent = {
        feeds: [],
        nextData: null,
      };
    }

    const {
      feeds,
    } = recent;
    feeds.unshift({
      date: new Date(),
      content,
    });

    await s3.putObject({
      Bucket: bucketName,
      Key: recentKey,
      Body: JSON.stringify(recent),
    }).promise();

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: 'Successfully posted',
        recent,
      }),
    };

    callback(null, response);
  }
  catch (err) {
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
