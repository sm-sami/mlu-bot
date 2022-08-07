import { Snowflake } from "discord.js";

export type Game = {
  gameId: string;
  title: string;
  description: string;
  answer: string;
  image: string;
  hints: Array<Hint>;
  isPosted: Boolean;
  createdAt: Date;
  messageId: Snowflake;
  threadId: Snowflake;
};

export type GameState = {
  userId: Snowflake;
  gameId: string;
  channelId: Snowflake;
};

export type Hint = {
  hint: string;
  timestamp: string;
};
