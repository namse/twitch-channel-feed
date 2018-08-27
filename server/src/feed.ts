import AWS = require('aws-sdk');
import uuid from 'uuid/v4';
import extractToken from './auth/extractToken';
import authenticateExtensionToken from './auth/authenticateExtensionToken';

const s3 = new AWS.S3();
const bucketName = 'twitch-channel-feed';
const COLD_DATA_LENGTH = 3;

type Recent = {
  feeds: string[];
  nextData?: string;
  coldData: string;
}

async function fetchOrNewRecent(recentKey: string) {
  try {
    const data = await s3.getObject({
      Bucket: bucketName,
      Key: recentKey,
    }).promise();
    return JSON.parse(data.Body as string);
  } catch (err) {
    if (err.code !== 'NoSuchKey') {
      throw err;
    }
    return {
      feeds: [],
      nextData: null,
    };
  }
}

function divideColdData(recent: Recent, userId: string) {
  if (recent.feeds.length < 2 * COLD_DATA_LENGTH) {
    return {
      newRecent: recent,
    };
  }

  const coldData = {
    feeds: recent.feeds.slice(recent.feeds.length - COLD_DATA_LENGTH),
    nextData: recent.nextData,
    key: `${userId}/${uuid()}.json`,
  };
  const newRecent = {
    feeds: recent.feeds.slice(0, recent.feeds.length - COLD_DATA_LENGTH),
    nextData: coldData.key,
  };

  return {
    newRecent,
    coldData,
  };
}

export async function post(event: any, callback: (error: Error, result: any) => void) {
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

    const token = extractToken(event.headers);
    const decoded = await authenticateExtensionToken(token);
    const {
      role,
      user_id: userId,
    } = decoded;
    if (role !== 'broadcaster') {
      throw new Error('you are not broadcaster. fuck you');
    }
    const recentKey = `${userId}/recent.json`;

    const recent = await fetchOrNewRecent(recentKey);

    const {
      feeds,
    } = recent;
    feeds.unshift({
      date: new Date(),
      content,
    });

    const { newRecent, coldData } = divideColdData(recent, userId);
    await s3.putObject({
      Bucket: bucketName,
      Key: recentKey,
      Body: JSON.stringify(newRecent),
    }).promise();

    if (coldData) {
      await s3.putObject({
        Bucket: bucketName,
        Key: coldData.key,
        Body: JSON.stringify(coldData),
      }).promise();
    }

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Successfully posted',
        recent,
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
