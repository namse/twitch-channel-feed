const AWS = require('aws-sdk');
const fileType = require('file-type');
const authExtTokenHeader = require('../authExtTokenHeader');
const encodeImage = require('./encodeImage');

const s3 = new AWS.S3();

const S3_BUCKET_BEFORE_ENCODE = 'twitch-channel-feed-media-before-encode';
const S3_BUCKET_AFTER_ENCODE = 'twitch-channel-feed-media-after-encode';

module.exports.post = async (event, context, callback) => {
  try {
    const {
      mediaId,
    } = event.pathParameters;
    const decoded = await authExtTokenHeader(event.headers);
    const {
      role,
      user_id: userId,
    } = decoded;
    if (role !== 'broadcaster') {
      throw new Error('you are not broadcaster. fuck you');
    }
    const key = `${userId}/${mediaId}`;

    const { Body: body } = await s3.getObject({
      Bucket: S3_BUCKET_BEFORE_ENCODE,
      Key: key,
    }).promise();

    console.log(fileType(body));
    const { ext, mime } = fileType(body);
    let encodedMedia;
    if (mime.startsWith('image/') && ext !== 'gif') {
      encodedMedia = await encodeImage(body)
    } else if (mime.startWith('video/')) {
      // use h265 with ffmpeg
      // 여기도 해라.
      // ㄴㄴ 영상은 나중에 하자
      throw new Error('NOT YET');
    }

    const encodedMediaMime = fileType(encodedMedia).mime;

    await s3.putObject({
      Bucket: S3_BUCKET_AFTER_ENCODE,
      Key: key,
      Body: encodedMedia,
      ContentType: encodedMediaMime,
    }).promise();


    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        url: `https://${S3_BUCKET_AFTER_ENCODE}.s3.amazonaws.com/${key}`,
        mime: encodedMediaMime,
      }),
    };
    callback(null, response);
  } catch (err) {
    console.error(err);
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
