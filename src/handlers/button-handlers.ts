import {
  ButtonInteraction,
  channelMention,
  roleMention,
  ChannelType,
} from "discord.js";
import { doesPlayerHaveChannel } from "../programs/game";
import {
  createConfirmButton,
  createCreateChannelButton,
  createGameEmbed,
} from "../utils/create";
import { chatGamesRole } from "../utils/constants";
import { getGameIdFromEmbed } from "../utils";
import { createGuessChannel, updateGameState } from "../programs/game";

export const handleConfirmButton = async (interaction: ButtonInteraction) => {
  await interaction.deferUpdate();

  if (interaction.channel && interaction.message) {
    const gameId = getGameIdFromEmbed(interaction.message);
    const gameEmbed = await createGameEmbed(gameId);
    const createChannelButtonRow = await createCreateChannelButton();
    const message = await interaction.channel.send({
      content: `${roleMention(chatGamesRole)}`,
      embeds: [gameEmbed!],
      components: [createChannelButtonRow],
    });
    const confirmButtonDisabledRow = await createConfirmButton(true);
    await interaction.editReply({ components: [confirmButtonDisabledRow] });
    await interaction.followUp({
      content: "New Guess the Place posted successfully!  :smile:",
      ephemeral: true,
    });

    if (message) await updateGameState(message);
  }
};

export const handleCreateChannelButton = async (
  interaction: ButtonInteraction
) => {
  const gameId = getGameIdFromEmbed(interaction.message);
  const playerState = await doesPlayerHaveChannel(interaction.user.id, gameId);

  if (interaction.guild) {
    if (!playerState) {
      const channel = await createGuessChannel(interaction, gameId);
      if (channel) {
        await interaction.reply({
          content: `Make a guess in ${channelMention(channel.id)} :smile:`,
          ephemeral: true,
        });
      }
      return;
    }
    await interaction.reply({
      content: `You already have a channel to guess ${channelMention(
        playerState.channelId
      )} :sloth:`,
      ephemeral: true,
    });
    return;
  }

  await interaction.reply("Something went wrong :pensive:");
};
