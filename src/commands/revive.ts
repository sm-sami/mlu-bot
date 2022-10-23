import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  roleMention,
} from "discord.js";
import { serverReviveRoleId } from "../utils/constants";
import { canReviveServer, getWaitTime } from "../programs/revive";

export = {
  data: new SlashCommandBuilder()
    .setName("revive")
    .setDescription("Revive the server!"),

  async handle(interaction: ChatInputCommandInteraction) {
    if (canReviveServer()) {
      if (interaction.channel) {
        await interaction.channel.send({
          content: roleMention(serverReviveRoleId),
        });
        await interaction.reply({
          content: `Pinged successfully!, you can ping again at <t:${getWaitTime()}:t> :sloth:`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Something went wrong :(",
          ephemeral: true,
        });
      }
      return;
    }

    await interaction.reply({
      content: `Server Revive was used recently, you can ping again <t:${getWaitTime()}:R>`,
      ephemeral: true,
    });
  },
};
