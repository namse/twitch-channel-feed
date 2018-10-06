const EMOTES_INFO_S3_BUCKET_ENDPOINT = 'https://s3.ap-northeast-2.amazonaws.com/twitch-emotes';
const EMOTES_AVAILABLE_S3_BUCKET_ENDPOINT = 'https://s3.ap-northeast-2.amazonaws.com/twitch-emotes-available-to-user';

if (!process.env.VUE_APP_API_GATEWAY_STAGE) {
  console.log(`api gateway stage not setup`);
}
const apiGatewayStage = process.env.VUE_APP_API_GATEWAY_STAGE;
const BACKEND_ENDPOINT = apiGatewayStage
  ? `https://api.twitchchannelfeed.com/${apiGatewayStage}`
  : 'http://localhost:3000';

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

export async function savePost(token: string, content: string): Promise<string> {
  const response = await fetch(
    `${BACKEND_ENDPOINT}/feed`,
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
  const {
    eTag,
  } = await response.json();
  return eTag;
}


export async function saveEmotes(token: string, userId: string, emotes: EmotesMap) {
  const response = await fetch(
    `${BACKEND_ENDPOINT}/emote`,
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
  const response = await fetch(`${BACKEND_ENDPOINT}/media/preSignedUrl`, {
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
  const response = await fetch(`${BACKEND_ENDPOINT}/media/${mediaId}/encode`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  await check2xx(response);
  return response.json();
}