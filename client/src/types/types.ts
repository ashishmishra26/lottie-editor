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

export type SocketTextMessage = {
  type: "message";
  id: string;
  playgroundId: string;
  username: string;
  text: string;
};

export type SocketUpdateMessage = {
  type: "update";
  json: string;
};

export type SocketUpdatePropMessage = {
  type: "updateProp";
  path: string;
  value: string;
};

export type SocketDeleteArrayItemMessage = {
  type: "deleteArrayItem";
  path: string;
  index: number;
};

export type SocketMessage =
  | SocketUpdateMessage
  | SocketTextMessage
  | SocketUpdatePropMessage
  | SocketDeleteArrayItemMessage;
