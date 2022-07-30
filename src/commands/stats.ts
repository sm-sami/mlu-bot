import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import { createUserStatsEmbed } from "../helpers";

export = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Get stats of a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User for whom the stats is to be shown.")
    ),

  async handle(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user") || interaction.user;

    try {
      if (user) {
        const playerStats = await createUserStatsEmbed(user);

        playerStats && (await interaction.reply({ embeds: [playerStats] }));
      }
    } catch (e) {
      console.log(e);
    }
  },
};
