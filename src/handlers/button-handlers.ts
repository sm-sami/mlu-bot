import { setTimeout as wait } from "node:timers/promises";
import {
  ButtonInteraction,
  PermissionsBitField,
  channelMention,
  roleMention,
  ChannelType,
} from "discord.js";
import {
  saveGameState,
  setPosted,
  doesPlayerHaveChannel,
} from "../helpers/game";
import {
  createConfirmButton,
  createCreateChannelButton,
  createGameEmbed,
} from "../utils/create";
import {
  chatGamesCategoryId,
  chatGamesRole,
  moderatorRoleId,
} from "../utils/constants";
import { getGameIdFromEmbed } from "../utils";

export const handleConfirmButton = async (interaction: ButtonInteraction) => {
  await interaction.deferUpdate();

  if (interaction.channel && interaction.message) {
    const gameId = getGameIdFromEmbed(interaction.message);
    let gameEmbed = await createGameEmbed(gameId);
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

    if (message) {
      await setPosted(getGameIdFromEmbed(message), message.id);
      await wait(1000 * 60 * 60 * 24);
      gameEmbed = await createGameEmbed(getGameIdFromEmbed(message), 0);
      message.edit({ embeds: [gameEmbed!] });
      await wait(3000);
      gameEmbed = await createGameEmbed(getGameIdFromEmbed(message), 1);
      message.edit({ embeds: [gameEmbed!] });
    }
  }
};

export const handleCreateChannelButton = async (
  interaction: ButtonInteraction
) => {
  const gameId = getGameIdFromEmbed(interaction.message);
  const playerState = await doesPlayerHaveChannel(interaction.user.id, gameId);

  if (interaction.guild) {
    if (!playerState) {
      const channel = await interaction.guild.channels.create({
        name: `${interaction.user.username} guess`,
        type: ChannelType.GuildText,
        parent: chatGamesCategoryId,
        permissionOverwrites: [
          {
            id: interaction.message.author.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ManageChannels,
            ],
          },
          {
            id: moderatorRoleId,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });
      await saveGameState(interaction.user.id, gameId, channel.id);
      await interaction.reply({
        content: `Make a guess in ${channelMention(channel.id)} :smile:`,
        ephemeral: true,
      });
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
