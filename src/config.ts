import "dotenv/config";

export const loadConfig = () => {
  if (!process.env.TOKEN) console.error("Bot requires TOKEN in .env");
  if (!process.env.CLIENT_ID) console.error("Bot requires CLIENT_ID in .env");
  if (!process.env.GUILD_ID) console.error("Bot requires GUILD_ID in .env");

  const token: string = process.env.TOKEN || "";
  const clientId: string = process.env.CLIENT_ID || "";
  const guildId: string = process.env.GUILD_ID || "";
  const dbUri: string = process.env.DB_URI || "";
  const dbName: string = process.env.DB_NAME || "";

  return {
    token,
    clientId,
    guildId,
    dbUri,
    dbName,
  };
};
