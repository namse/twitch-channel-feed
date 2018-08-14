export async function getFeeds(userId): Promise<Feed[]> {
  const response = await fetch(`https://s3.ap-northeast-2.amazonaws.com/twitch-channel-feed/${userId}/recent.json`);
  if (response.status === 403) {
    return [];
  }
  const json = await response.json();
  return json.feeds;
}