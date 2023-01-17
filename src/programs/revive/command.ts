import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  roleMention,
} from "discord.js";

import { canReviveServer, getWaitTime } from "./";
import { sendChatApplicationCommandErrorEmbed } from "../../utils";
import { createReviveEmbed } from "../../utils/create";
import { serverReviveRoleId } from "../../utils/constants";

export = {
  data: new SlashCommandBuilder()
    .setName("revive")
    .setDescription("Revive the server!")
    .addStringOption((option) =>
      option.setName("text").setDescription("Say something to the server!")
    ),

  async handle(interaction: ChatInputCommandInteraction) {
    const text = interaction.options.getString("text");

    const embed = createReviveEmbed(
      text ?? "Wake up server!",
      interaction.user
    );

    if (canReviveServer()) {
      if (interaction.channel) {
        await interaction.channel.send({
          content: `${roleMention(serverReviveRoleId)}`,
          embeds: [embed],
        });
        await interaction.reply({
          content: `Pinged successfully!, you can ping again at <t:${getWaitTime()}:t> :sloth:`,
          ephemeral: true,
        });
      } else {
        await sendChatApplicationCommandErrorEmbed(
          interaction,
          "Channel cannot be found!"
        );
      }
      return;
    }

    await interaction.reply({
      content: `Server Revive was used recently, you can ping again <t:${getWaitTime()}:R>`,
      ephemeral: true,
    });
  },
};
