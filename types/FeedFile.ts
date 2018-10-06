export type FeedFile = {
  feeds: Feed[];
  nextData?: string;
  key: string;
};

export type Feed = {
  id: string;
  date: Date;
  content: string;
};
