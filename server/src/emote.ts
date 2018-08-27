import AWS = require('aws-sdk');
import extractToken from './auth/extractToken';
import authenticateIdToken from './auth/authenticateIdToken';

const s3 = new AWS.S3();
const TWITCH_EMOTES_AVAILABLE_TO_USER_BUCKET = 'twitch-emotes-available-to-user';

export async function post(event: any, _: any, callback: (error: Error, result: any) => void) {
  try {
    const body = JSON.parse(event.body);
    const {
      userId,
      emotesMap,
    } = body;
    const token = extractToken(event.headers);
    const decoded = await authenticateIdToken(token);
    const {
      sub,
    } = decoded;
    if (sub !== userId) {
      throw new Error('you have wrong token.');
    }

    await s3.putObject({
      Bucket: TWITCH_EMOTES_AVAILABLE_TO_USER_BUCKET,
      Key: userId,
      Body: JSON.stringify(emotesMap),
    }).promise();

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Successfully saved',
      }),
    };

    callback(null, response);
  } catch (err) {
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(err, Object.getOwnPropertyNames(err)),
    };
    callback(null, response);
  }
};
