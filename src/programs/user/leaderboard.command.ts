import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { createLeaderboardEmbed } from "../../utils/create";
import { getTopTenUsers } from "./controllers";

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
