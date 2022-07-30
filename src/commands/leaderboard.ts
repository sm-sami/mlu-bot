import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import { createLeaderboardEmbed } from "../helpers";

export = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Get the leaderboard"),

  async handle(interaction: ChatInputCommandInteraction) {
    const leaderboardStats = await createLeaderboardEmbed();
    leaderboardStats &&
      (await interaction.reply({ embeds: [leaderboardStats] }));
  },
};
