export type Video = {
  title: string;
  cloudinaryId: string;
};

export type Chapter = {
  title: string;
  videos: Video[];
};

export type Course = {
  _id: string;
  title: string;
  description?: string;
  chapters: Chapter[];
};
