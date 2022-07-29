import { Client, GatewayIntentBits, Interaction } from "discord.js";
import { deployCommands } from "./utils";
import { handleInputCommandInteraction } from "./interactions";
import { loadConfig } from "./config";

const { token } = loadConfig();
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once("ready", () => console.log("Bot Online!"));

bot.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  await handleInputCommandInteraction(interaction);
});

bot
  .login(token)
  .then(() => bot.user!.setActivity("/stats"))
  .then(() =>
    deployCommands()
      .then(() => console.log("✅ Commands registered successfully"))
      .catch(() => console.error)
  )
  .catch(() => console.error);
