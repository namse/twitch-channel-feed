export const TWITCH_APP_CLIENT_ID = 'nmbqgdv3qbinn9z3088sw816t834jx';

declare type UserEmotesResponse = {
  [EmoteSetId: string]: {
    code: string,
    id: number,
  }[],
};

export async function getUserEmotes(accessToken: string, userId: string): Promise<UserEmotesResponse> {
  const response = await fetch(`https://api.twitch.tv/kraken/users/${userId}/emotes`, {
    headers: {
      'Authorization': `OAuth ${accessToken}`,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_APP_CLIENT_ID,
    }
  });
  const json = await response.json();
  return json.emoticon_sets;
}

export async function getUser(accessToken: string) {
  const response = await fetch('https://api.twitch.tv/kraken/user', {
    headers: {
      'Authorization': `OAuth ${accessToken}`,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_APP_CLIENT_ID,
    },
  });
  const json = await response.json();
  return json;
}

export async function getChannel(userId: string) {
  // TODO 캐싱할 것
  const response = await fetch(`https://api.twitch.tv/kraken/channels/${userId}`, {
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_APP_CLIENT_ID,
    },
  });
  const json = await response.json();
  return json;
}

export async function getProfilePicture(userId: string) {
  const channel = await getChannel(userId);
  return channel.logo;
}

export async function getUsername(userId: string) {
  const channel = await getChannel(userId);
  return channel.display_name;
}