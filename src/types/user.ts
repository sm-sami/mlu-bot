import { Snowflake, User } from "discord.js";

export interface GameUser {
  userId: Snowflake;
  numberOfWins: number;
  points: number;
  user: User;
}
