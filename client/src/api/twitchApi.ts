export const TWITCH_CLIENT_ID = 'nmbqgdv3qbinn9z3088sw816t834jx';

export async function getUserEmotes(accessToken, userId) {
  const response = await fetch(`https://api.twitch.tv/kraken/users/${userId}/emotes`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_CLIENT_ID,
    }
  });
  const json = await response.json();
  return json.emoticon_sets;
}

export async function getUser(accessToken) {
  const response = await fetch('https://api.twitch.tv/kraken/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_CLIENT_ID,
    },
  });
  const json = await response.json();
  return json;
}

export async function getChannel(userId) {
  // TODO 캐싱할 것
  const response = await fetch(`https://api.twitch.tv/kraken/channels/${userId}`, {
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_CLIENT_ID,
    },
  });
  const json = await response.json();
  return json;
}

export async function getProfilePicture(userId) {
  const channel = await getChannel(userId);
  return channel.logo;
}

export async function getUsername(userId) {
  const channel = await getChannel(userId);
  return channel.display_name;
}