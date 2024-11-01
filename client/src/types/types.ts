export type Message = {
  id: string;
  username: string;
  text: string;
  playgroundId: string;
};

export interface Playground {
  id: string;
  json: string;
  Message: Message[];
}

export type FeaturedAnimation = {
  id: number;
  gifUrl: null | string;
  name: string;
  likesCount: number;
  url: string;
  lottieUrl: string;
  jsonUrl: string;
  createdBy: {
    username: string;
    avatarUrl: string;
    firstName: string | null;
    lastName: string | null;
  };
};

export type FeaturedAnimationsListResponseData = {
  nextCursor: string;
  animations: FeaturedAnimation[];
};
