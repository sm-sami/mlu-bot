import { Snowflake } from "discord.js";

export interface Game {
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
}

export interface GameState {
  userId: Snowflake;
  gameId: string;
  channelId: Snowflake;
}

export interface Hint {
  hint: string;
  timestamp: string;
}
