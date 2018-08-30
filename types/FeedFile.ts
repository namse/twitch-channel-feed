export type FeedFile = {
  feeds: Feed[];
  nextData?: string;
  key?: string;
};

export type Feed = {
  date: Date;
  content: string;
};
