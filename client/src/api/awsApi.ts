import { FeedFile } from '../../../types/FeedFile';
import wait from '@/utils/wait';

export async function getRecentFeedFile(userId: string, eTag: string = ''): Promise<FeedFile> {
  return await getFeedFile(`${userId}/recent.json`, eTag);
}

export async function getFeedFile(key: string, eTag: string = ''): Promise<FeedFile> {
  const headers = {};
  if (eTag.length) {
    headers['If-Match'] = eTag;
  }
  const response = await fetch(`https://s3.ap-northeast-2.amazonaws.com/twitch-channel-feed/${key}`, {
    headers,
  });
  switch (response.status) {
    case 403: {
      return {
        feeds: [],
        key,
      };
    }
    case 412: {
      await wait(1000);
      return getFeedFile(key, eTag);
    }
  }
  const json = await response.json();
  return json;
}
