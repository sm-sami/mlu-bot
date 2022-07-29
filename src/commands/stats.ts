import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from "discord.js";
import { getUserStats } from "../controllers/user-controllers";

export = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Get stats of a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User for whom the stats is to be shown.')),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;

    try {
      if (user) {
        if (typeof interaction.channel ) await getUserStats(user, interaction.channel);
      }
    } catch (e) {
      console.log(e);
    }
  }
};