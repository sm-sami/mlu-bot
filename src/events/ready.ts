import { Client } from "discord.js";
import {
  loadCommands,
  deployCommands,
} from "../utils/slash-commands";
import { loadChatTriggers } from "../programs/triggers";

export const onReady = async (bot: Client) => {
  if (bot.user) {
    console.log(`✅  Logged in as ${bot.user.tag}!`);
    bot.user.setActivity("Guess the Place");
  }
  await loadCommands();
  await deployCommands();
  await loadChatTriggers();
  console.log("✅  Bot Ready!");
};
