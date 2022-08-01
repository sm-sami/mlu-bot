import {
  Client,
  Interaction,
  Message,
  GatewayIntentBits,
  ChannelType,
} from "discord.js";
import {
  handleInputCommandInteraction,
  handleButtonInteraction,
  handleGuildTextMessage,
} from "./handlers";
import { deployCommands } from "./utils/deploy-commands";
import { initializeClient } from "./utils/database";
import { token } from "./utils/constants";

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

bot.once("ready", () => console.log("✔️Bot Ready!"));

bot.on("interactionCreate", async (interaction: Interaction) => {
  if (interaction.isChatInputCommand())
    await handleInputCommandInteraction(interaction);
  if (interaction.isButton()) await handleButtonInteraction(interaction);
});

bot.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  switch (message.channel.type) {
    case ChannelType.GuildText:
      await handleGuildTextMessage(message);
      break;
  }
});

bot
  .login(token)
  .then(() => bot.user!.setActivity("/stats"))
  .then(() => deployCommands())
  .then(() => initializeClient())
  .catch(() => console.error);
