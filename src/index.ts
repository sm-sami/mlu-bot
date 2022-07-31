import { Client, Interaction, GatewayIntentBits } from "discord.js";
import {
  handleInputCommandInteraction,
  handleButtonInteraction,
} from "./handlers";
import { deployCommands } from "./utils/deploy-commands";
import { initializeClient } from "./utils/database";
import { token } from "./utils/constants";

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once("ready", () => console.log("✔️Bot Ready!"));

bot.on("interactionCreate", async (interaction: Interaction) => {
  if (interaction.isChatInputCommand())
    await handleInputCommandInteraction(interaction);
  if (interaction.isButton()) await handleButtonInteraction(interaction);
});

bot
  .login(token)
  .then(() => bot.user!.setActivity("/stats"))
  .then(() => deployCommands())
  .then(() => initializeClient())
  .catch(() => console.error);
