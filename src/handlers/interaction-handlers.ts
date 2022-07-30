import type { ChatInputCommandInteraction } from "discord.js";

import path from "node:path";

export const handleInputCommandInteraction = async (
  interaction: ChatInputCommandInteraction
) => {
  const commandName = interaction.commandName;
  const commandFile = path.join(__dirname, "../commands", `${commandName}.js`);

  const command = require(commandFile);
  await command.handle(interaction);
};
