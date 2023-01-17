import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

import { getTopTenUsers } from "./controllers";
import { createLeaderboardEmbed } from "../../utils/create";

export = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Get the leaderboard"),

  async handle(interaction: ChatInputCommandInteraction) {
    const topTenUsers = await getTopTenUsers();
    const leaderboardStats = await createLeaderboardEmbed(topTenUsers);
    leaderboardStats &&
      (await interaction.reply({ embeds: [leaderboardStats] }));
  },
};
