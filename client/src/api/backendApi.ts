const EMOTES_INFO_S3_BUCKET_ENDPOINT = 'https://s3.ap-northeast-2.amazonaws.com/twitch-emotes';
const EMOTES_AVAILABLE_S3_BUCKET_ENDPOINT = 'https://s3.ap-northeast-2.amazonaws.com/twitch-emotes-available-to-user';

// TODO : change this after getting domain
let BACKEND_ENDPOINT;
const BACKEND_ENDPOINT_JSON_URL = 'https://s3.ap-northeast-2.amazonaws.com/twitch-channel-feed-api-endpoint/endpoints.json';
async function getBackendEndpoint() {
  const stage = process.env.API_GATEWAY_STAGE;
  if (!stage) {
    throw new Error('No API GATEWAY STAGE');
  }

  if (BACKEND_ENDPOINT) {
    return BACKEND_ENDPOINT;
  }
  const response = await fetch(BACKEND_ENDPOINT_JSON_URL);
  const json = await response.json();
  BACKEND_ENDPOINT = json[stage];
  return BACKEND_ENDPOINT;
}

export async function check2xx(response: Response) {
  if (response.status >= 200 || response.status < 300) {
    return;
  } else {
    const json = await response.json();
    throw new Error(json);
  }
}

export async function getEmotesinfo(emoteSetId: string): Promise<Emote[]> {
  const response = await fetch(`${EMOTES_INFO_S3_BUCKET_ENDPOINT}/${emoteSetId}`);
  return await response.json();
}

export async function savePost(token: string, content: string) {
  const response = await fetch(
    `${await getBackendEndpoint()}/feed`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
      }),
    },
  );
  await check2xx(response);
}


export async function saveEmotes(token: string, userId: string, emotes: EmotesMap) {
  const response = await fetch(
    `${await getBackendEndpoint()}/emote`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        emotes,
      }),
    },
  );
  await check2xx(response);
}

export async function getEmotesAvailable(userId: string): Promise<EmotesMap> {
  const response = await fetch(`${EMOTES_AVAILABLE_S3_BUCKET_ENDPOINT}/${userId}`);
  return await response.json();
}

export type PreSignedUrlResponse = {
  url: string;
  fields: { [key: string]: string };
  mediaId: string;
  key: string;
};

export async function getPreSignedUrl(token: string): Promise<PreSignedUrlResponse> {
  const response = await fetch(`${await getBackendEndpoint()}/media/preSignedUrl`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  await check2xx(response);
  return response.json();
}

export type EncodeMediaResponse = {
  url: string,
  mime: string,
};

export async function encodeMedia(token: string, mediaId: string): Promise<EncodeMediaResponse> {
  const response = await fetch(`${await getBackendEndpoint()}/media/${mediaId}/encode`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  await check2xx(response);
  return response.json();
}