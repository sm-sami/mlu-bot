import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { createUserStatsEmbed } from "../../utils/create";
import { getUserData } from "./controllers";

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
        const userData = await getUserData(user);
        const playerStats = await createUserStatsEmbed(user, userData);

        playerStats && (await interaction.reply({ embeds: [playerStats] }));
      }
    } catch (e) {
      console.log(e);
    }
  },
};
