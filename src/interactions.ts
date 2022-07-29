import { ChatInputCommandInteraction } from "discord.js";

export const handleInputCommandInteraction = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.commandName) {
    case 'ping':
      await interaction.reply('Pong!');
      break;
  }
}