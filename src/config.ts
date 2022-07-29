import "dotenv/config"

export const loadConfig = () => {
  let token: string = '';
  let clientId: string = '';
  let guildId: string = '';
  if (process.env.TOKEN) {
    token = process.env.TOKEN;
  } else {
    console.error('Bot requires TOKEN in .env');
  }

  if (process.env.CLIENT_ID) {
    clientId = process.env.CLIENT_ID;
  } else {
    console.error('Bot requires CLIENT_ID in .env');
  }

  if (process.env.GUILD_ID) {
    guildId = process.env.GUILD_ID;
  } else {
    console.error('Bot requires GUILD_ID in .env');
  }

  return {
    token,
    clientId,
    guildId
  }
}