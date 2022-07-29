import { Client, GatewayIntentBits } from "discord.js";
import { deployCommands } from "./deploy-commands"
import { loadConfig } from "./config";

const { token } = loadConfig();
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once('ready', () => console.log('Bot Online!'));

bot.login(token)
  .then(() => bot.user!.setActivity('/help'))
  .then(() => deployCommands()
    .then(() => console.log("✅ Commands registered successfully"))
    .catch(() => console.error))
  .catch(() => console.error);
