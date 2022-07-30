import { Client, GatewayIntentBits, Interaction } from "discord.js";
import { deployCommands, initializeClient } from "./utils";
import { handleInputCommandInteraction } from "./interactions";
import { loadConfig } from "./config";

const { token } = loadConfig();
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once("ready", () => console.log("✔️Bot Ready!"));

bot.on("interactionCreate", async (interaction: Interaction) => {
  if (interaction.isChatInputCommand())
    await handleInputCommandInteraction(interaction);
});

bot
  .login(token)
  .then(() => bot.user!.setActivity("/stats"))
  .then(() => deployCommands())
  .then(() => initializeClient())
  .catch(() => console.error);
