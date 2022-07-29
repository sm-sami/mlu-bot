import { Client, GatewayIntentBits } from "discord.js";
import { loadConfig } from "./config";

const { token } = loadConfig();
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once('ready', () => console.log('Bot Online!'));

bot.login(token)
  .then(() => bot.user!.setActivity('/help'))
  .catch(() => console.error);
