import path from "node:path";
import { ChatInputCommandInteraction, ButtonInteraction } from "discord.js";
import { handleConfirmButton } from "./button-handlers";

export const handleInputCommandInteraction = async (
  interaction: ChatInputCommandInteraction
) => {
  const commandName = interaction.commandName;
  const commandFile = path.join(__dirname, "../commands", `${commandName}.js`);

  const command = require(commandFile);
  await command.handle(interaction);
};

export const handleButtonInteraction = async (
  interaction: ButtonInteraction
) => {
  const buttonId = interaction.customId;

  switch (buttonId) {
    case "confirm-post":
      await handleConfirmButton(interaction);
      break;
  }
};
