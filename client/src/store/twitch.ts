export type TwitchUser = {
  _id: string;
  bio: string;
  created_at: Date;
  display_name: string;
  email: string;
  email_verified: boolean,
  logo: string;
  name: string;
  notifications: {
    email: boolean,
    push: boolean
  },
  partnered: boolean,
  twitter_connected: boolean,
  type: string;
  updated_at: Date;
};

export type EmoticonSets = {
  [emoteSet: string]: {
    code: string;
    id: number;
  };
};

export type ExtensionAuth = {
  channelId: string;
  clientId: string;
  token: string;
  userId: string;
};