import { Snowflake, User } from "discord.js";

export type GameUser = {
  userId: Snowflake;
  numberOfWins: number;
  points: number;
  user: User;
};
