declare type EmotesOnS3 = {
  id: string;
  code: string;
  emoteSetId: string;
  url: string;
}[];

declare type EmotesAvaialbleToUser = {
  [emoteSetId: string]: EmotesOnS3
};

const EMOTE_INFO_S3_BUCKET_ENDPOINT = 'https://s3.ap-northeast-2.amazonaws.com/twitch-emotes';
const BACKEND_ENDPOINT = 'https://yaauic5zfh.execute-api.ap-northeast-2.amazonaws.com/dev';

async function check2xx(response: Response) {
  if (response.status >= 200 || response.status < 300) {
    return;
  } else {
    const json = await response.json();
    throw new Error(json);
  }
}

export async function getEmotesinfo(emoteSetId: string): Promise<EmotesOnS3> {
  const response = await fetch(`${EMOTE_INFO_S3_BUCKET_ENDPOINT}/${emoteSetId}`);
  const emotesOnS3: EmotesOnS3 = await response.json();
  return emotesOnS3;
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


export async function saveEmotes(token: string, userId: string, emotes: EmotesAvaialbleToUser) {
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
