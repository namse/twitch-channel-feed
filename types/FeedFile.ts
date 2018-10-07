export interface FeedFile {
  feeds: Feed[];
  nextData?: string;
  key: string;
}

export interface Feed {
  id: string;
  date: Date;
  content: string;
}
