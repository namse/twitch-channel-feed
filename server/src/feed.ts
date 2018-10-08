import AWS = require('aws-sdk');
import uuid from 'uuid/v4';
import extractToken from './auth/extractToken';
import authenticateExtensionToken from './auth/authenticateExtensionToken';
import { FeedFile } from '../../types/FeedFile';

const s3 = new AWS.S3();
const bucketName = 'twitch-channel-feed';
const COLD_DATA_LENGTH = 3;

function getRecentKey(userId) {
  return `${userId}/recent.json`;
}

async function fetchOrNewRecent(recentKey: string): Promise<FeedFile> {
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
      key: recentKey,
    };
  }
}

function divideColdData(recent: FeedFile, userId: string): { newRecent: FeedFile, coldData?: FeedFile } {
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
    key: getRecentKey(userId),
  };

  return {
    newRecent,
    coldData,
  };
}

function checkContentSize(content: string) {
  const MAX_WIDTH = 500;
  const MAX_HEIGHT = 1000;
  const BASE64_BYTE_RATE = 8 / 6;
  const MAX_CONTENT_LENGTH = MAX_WIDTH * MAX_HEIGHT * BASE64_BYTE_RATE;

  if (content.length > MAX_CONTENT_LENGTH) {
    throw new Error(`Too big content: ${content.length}`);
  }
}

export async function post(event: any, _: any, callback: (error: Error, result: any) => void) {
  try {
    const body = JSON.parse(event.body);
    const {
      content,
    } = body;

    checkContentSize(content);

    const token = extractToken(event.headers);
    const decoded = await authenticateExtensionToken(token);
    const {
      role,
      user_id: userId,
    } = decoded;
    if (role !== 'broadcaster') {
      throw new Error('you are not broadcaster. fuck you');
    }
    const recentKey = getRecentKey(userId);

    const recent = await fetchOrNewRecent(recentKey);

    const {
      feeds,
    } = recent;
    feeds.unshift({
      id: uuid(),
      date: new Date(),
      content,
    });

    const { newRecent, coldData } = divideColdData(recent, userId);
    const { ETag: eTag } = await s3.putObject({
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
    console.log(eTag);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Successfully posted',
        recent,
        eTag,
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
}


async function findFileOfFeed(userId: string, feedId: string): Promise<FeedFile> {
  let key = getRecentKey(userId);
  while (key) {
    const data = await s3.getObject({
      Bucket: bucketName,
      Key: key,
    }).promise();

    const feedFile: FeedFile = JSON.parse(data.Body as string);
    if (key === getRecentKey(userId)) {
      feedFile.key = getRecentKey(userId); // Temporally becuase data type has changed.
    }
    const hasFoundFeed = feedFile.feeds.some(feed => feed.id === feedId);
    if (hasFoundFeed) {
      return feedFile;
    }
    key = feedFile.nextData;
  }
}

export async function put(event: any, _: any, callback: (error: Error, result: any) => void) {
  try {
    const body = JSON.parse(event.body);
    const {
      content,
    } = body;

    const {
      feedId,
    } = event.pathParameters;

    checkContentSize(content);

    const token = extractToken(event.headers);
    const decoded = await authenticateExtensionToken(token);
    const {
      role,
      user_id: userId,
    } = decoded;
    if (role !== 'broadcaster') {
      throw new Error('you are not broadcaster. fuck you');
    }

    const file = await findFileOfFeed(userId, feedId);

    if (!file) {
      return callback(null, { statusCode: 404, body: 'Not found', headers: { 'Content-Type': 'text/plain' } });
    }

    const foundFeed = file.feeds.find(feed => feed.id === feedId);
    if (!foundFeed) {
      throw new Error('cannot find feed in file');
    }
    foundFeed.content = content;

    const { ETag: eTag } = await s3.putObject({
      Bucket: bucketName,
      Key: file.key,
      Body: JSON.stringify(file),
    }).promise();

    console.log(eTag);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Successfully posted',
        eTag,
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
}

export async function remove(event: any, _: any, callback: (error: Error, result: any) => void) {
  try {
    const {
      feedId,
    } = event.pathParameters;

    const token = extractToken(event.headers);
    const decoded = await authenticateExtensionToken(token);
    const {
      role,
      user_id: userId,
    } = decoded;
    if (role !== 'broadcaster') {
      throw new Error('you are not broadcaster. fuck you');
    }

    const file = await findFileOfFeed(userId, feedId);

    if (!file) {
      return callback(null, { statusCode: 404, body: 'Not found', headers: { 'Content-Type': 'text/plain' } });
    }

    console.log(file.feeds.map(feed => feed.id));
    const feedIndex = file.feeds.findIndex(feed => feed.id === feedId);
    console.log(feedIndex);
    if (feedIndex === -1) {
      throw new Error('cannot find feed in file');
    }
    file.feeds.splice(feedIndex, 1);

    await s3.putObject({
      Bucket: bucketName,
      Key: file.key,
      Body: JSON.stringify(file),
    }).promise();

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Successfully deleted',
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
}
