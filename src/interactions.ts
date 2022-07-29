import path from "node:path";
import { commands } from "./utils/deploy-commands";
import { ChatInputCommandInteraction } from "discord.js";

export const handleInputCommandInteraction = async (
  interaction: ChatInputCommandInteraction
) => {
  const commandName = interaction.commandName;

  const commandsPath = path.join(__dirname, "commands");
  const filePath = path.join(commandsPath, `${commandName}.js`);

  const command = require(filePath);
  await command.execute(interaction);
};
