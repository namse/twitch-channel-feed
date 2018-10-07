import { getPreSignedUrl, check2xx, encodeMedia, EncodeMediaResponse } from '@/api/backendApi';

export default async function uploadMedia(token: string, file: File): Promise<EncodeMediaResponse> {
  const {
    url,
    fields,
    mediaId,
    key: s3Key,
  } = await getPreSignedUrl(token);

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.set(key, value);
  });
  formData.set('key', s3Key);
  formData.set('file', file);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  await check2xx(response);

  const encodeMediaResponse = await encodeMedia(token, mediaId);

  return encodeMediaResponse;
}
