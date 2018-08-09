declare type Emote = {
  id: string;
  regex: string;
  emoteSetId: string;
  url: string;
};

declare type EmotesMap = {
  [emoteSetId: string]: Emote[];
};
