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
      await interaction.reply({
        content: roleMention(serverReviveRoleId),
      });
      return;
    }

    await interaction.reply({
      content: `Server Revive was used recently, you can ping again <t:${getWaitTime()}:R>`,
      ephemeral: true,
    });
  },
};
