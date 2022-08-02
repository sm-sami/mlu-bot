import { setTimeout as wait } from "timers/promises";
import {
  ButtonInteraction,
  PermissionsBitField,
  Message,
  ChannelType,
} from "discord.js";
import { saveGameState, setPosted } from "../controllers/game";
import { getGameIdFromEmbed } from "../utils";
import { createGameEmbed } from "../utils/create";
import { chatGamesCategoryId, moderatorRoleId } from "../utils/constants";

export const updateGameState = async (message: Message) => {
  await setPosted(getGameIdFromEmbed(message), message.id);
  await wait(1000 * 60 * 60 * 24);
  let gameEmbed = await createGameEmbed(getGameIdFromEmbed(message), 0);
  await message.edit({ embeds: [gameEmbed!] });
  await wait(3000 * 60 * 60 * 24);
  gameEmbed = await createGameEmbed(getGameIdFromEmbed(message), 1);
  await message.edit({ embeds: [gameEmbed!] });
};

export const createGuessChannelAndSaveState = async (
  interaction: ButtonInteraction,
  gameId: string
) => {
  try {
    if (interaction.guild) {
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
      return channel;
    }
  } catch (e) {
    console.log(e);
  }
};
