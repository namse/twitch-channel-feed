import { FeedFile } from '../../../types/FeedFile';

export async function getRecentFeedFile(userId: string): Promise<FeedFile> {
  return await getFeedFile(`${userId}/recent.json`);
}

export async function getFeedFile(key: string): Promise<FeedFile> {
  const response = await fetch(`https://s3.ap-northeast-2.amazonaws.com/twitch-channel-feed/${key}`);
  if (response.status === 403) {
    return {
      feeds: [],
    };
  }
  const json = await response.json();
  return json;
}