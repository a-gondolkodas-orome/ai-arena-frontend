export type PlayerCount = {
  min: number;
  max: number;
};

export type Game = {
  id: string;
  name: string;
  shortDescription: string;
  /** base64 representation of a "profile" picture for the game */
  picture: string;
  /** The complete definition of the game, including the communication protocol. */
  fullDescription: string;
  playerCount: PlayerCount;
};
