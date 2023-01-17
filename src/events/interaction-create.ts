import {
  ChatInputCommandInteraction,
  ButtonInteraction,
  Interaction,
  InteractionType,
} from "discord.js";
import { bot_commands as commands } from "../utils/slash-commands";
import { createGuessChannel, postGame } from "../programs/game";

export const handleInteractionCreate = async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    await handleInputCommandInteraction(interaction);
  } else if (interaction.isButton()) {
    await handleButtonInteraction(interaction);
  }
};

const handleInputCommandInteraction = async (
  interaction: ChatInputCommandInteraction
) => {
  const command = commands.get(interaction.commandName);
  if (command) await command.handle(interaction);
};

const handleButtonInteraction = async (interaction: ButtonInteraction) => {
  const buttonId = interaction.customId;

  switch (buttonId) {
    case "confirm-post":
      await postGame(interaction);
      break;
    case "create-channel":
      await createGuessChannel(interaction);
      break;
  }
};
