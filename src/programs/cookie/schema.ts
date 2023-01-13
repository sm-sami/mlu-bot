import { Snowflake, User } from "discord.js";

export interface CookieUser {
  userId: Snowflake;
  cookies: number;
  user: User;
}
