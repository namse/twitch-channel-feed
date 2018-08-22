const EMOTES_INFO_S3_BUCKET_ENDPOINT = 'https://s3.ap-northeast-2.amazonaws.com/twitch-emotes';
const EMOTES_AVAILABLE_S3_BUCKET_ENDPOINT = 'https://s3.ap-northeast-2.amazonaws.com/twitch-emotes-available-to-user';
const BACKEND_ENDPOINT = 'https://yaauic5zfh.execute-api.ap-northeast-2.amazonaws.com/dev';

async function check2xx(response: Response) {
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
    `${BACKEND_ENDPOINT}/feed`,
    {
      method: 'POST',
      body: JSON.stringify({
        token,
        content,
      }),
    },
  );
  await check2xx(response);
}


export async function saveEmotes(token: string, userId: string, emotes: EmotesMap) {
  const response = await fetch(
    `${BACKEND_ENDPOINT}/emote`,
    {
      method: 'POST',
      body: JSON.stringify({
        token,
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
  key: string;
};

export async function getPreSignedUrl(token: string): Promise<PreSignedUrlResponse> {
  const response = await fetch(`${BACKEND_ENDPOINT}/media/preSignedUrl`);
  await check2xx(response);
  return response.json();
}

