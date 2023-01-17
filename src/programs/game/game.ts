import { setTimeout as wait } from "timers/promises";
import {
  ButtonInteraction,
  PermissionsBitField,
  Message,
  ChannelType,
  roleMention,
  ChatInputCommandInteraction,
  channelMention,
} from "discord.js";
import {
  saveGameState,
  setPosted,
  getHints,
  cleanUpGames,
  getGameStates,
  getGameData,
  getGameHostId,
  doesPlayerHaveChannel,
} from "./controllers";
import { getGameIdFromEmbed } from "../../utils";
import {
  createConfirmButton,
  createCreateChannelButton,
  createGameEmbed,
  createGameEndEmbed,
} from "../../utils/create";
import {
  chatGamesRole,
  chatGamesCategoryId,
  moderatorRoleId,
} from "../../utils/constants";

export const sendPreviewEmbed = async (
  interaction: ChatInputCommandInteraction,
  gameId: string
) => {
  try {
    const gameEmbed = await createGameEmbed(gameId);
    const confirmButtonRow = await createConfirmButton();

    if (gameEmbed && confirmButtonRow) {
      await interaction.reply({
        content: `Do you want to post this?`,
        embeds: [gameEmbed],
        ephemeral: true,
        components: [confirmButtonRow],
      });
      await wait(1000 * 60 * 10);
      await cleanUpGames();
      const confirmButtonDisabledRow = await createConfirmButton(true);
      await interaction.editReply({
        components: [confirmButtonDisabledRow],
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export const postGame = async (interaction: ButtonInteraction) => {
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

export const updateGameState = async (message: Message) => {
  const gameId = getGameIdFromEmbed(message);
  const thread = await message.startThread({ name: `Guess the Place` });
  await setPosted(gameId, message.id, thread.id);
  const hints = await getHints(gameId);
  await wait(1000 * 60 * 60 * 24);
  let gameEmbed = await createGameEmbed(gameId, 0);
  if (hints)
    await thread.send({
      content: `[${roleMention(chatGamesRole)}] hint #1: ${hints[0].hint}`,
    });
  await message.edit({ embeds: [gameEmbed!] });
  await wait(1000 * 60 * 60 * 24 * 2);
  gameEmbed = await createGameEmbed(gameId, 1);
  if (hints)
    await thread.send({
      content: `[${roleMention(chatGamesRole)}] hint #2: ${hints[1].hint}`,
    });
  await message.edit({ embeds: [gameEmbed!] });
};

export const createGuessChannel = async (interaction: ButtonInteraction) => {
  const gameId = getGameIdFromEmbed(interaction.message);
  const playerState = await doesPlayerHaveChannel(interaction.user.id, gameId);

  if (interaction.guild) {
    if (!playerState) {
      const gameHostId = await getGameHostId(gameId);
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
          {
            id: gameHostId,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });
      await saveGameState(interaction.user.id, gameId, channel.id);

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

export const deleteChannels = async (
  interaction: ChatInputCommandInteraction,
  gameId: string
) => {
  if (interaction.guild) {
    const gameStates = await getGameStates(gameId);
    if (gameStates) {
      for (const state of gameStates) {
        try {
          await interaction.guild.channels.delete(state.channelId);
        } catch (e) {
          await interaction.followUp({
            content: `Not able to delete #${state.channelId}`,
            ephemeral: true,
          });
          console.log(e);
        }
      }
    }
  }
};

export const endGame = async (
  interaction: ChatInputCommandInteraction,
  gameId: string
) => {
  const gameData = await getGameData(gameId);
  if (gameData && interaction.channel) {
    await interaction.reply({
      content: `Ending game with ID \`${gameData.gameId}\``,
      ephemeral: true,
    });
    const createChannelButtonDisabledRow = await createCreateChannelButton(
      true
    );
    await interaction.channel.messages.edit(gameData.messageId, {
      components: [createChannelButtonDisabledRow],
    });

    const gameEndEmbed = await createGameEndEmbed(gameId);
    if (gameEndEmbed) {
      await interaction.channel.send({
        content: `${roleMention(chatGamesRole)}`,
        embeds: [gameEndEmbed],
      });
    }
    await deleteChannels(interaction, gameData.gameId);
  }
};
