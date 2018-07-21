export async function getFeedContents(userId) {
  const response = await fetch(`https://s3.ap-northeast-2.amazonaws.com/twitch-channel-feed/${userId}/recent.json`);
  const json = await response.json();
  return json.feeds;
}