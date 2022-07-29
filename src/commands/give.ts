import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from "discord.js";
import { getUserStats, updateUserPoints } from "../controllers/user-controllers";

export = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('Give points to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to which point is to be given')
        .setRequired(true))
    .addNumberOption(option =>
      option.setName('points')
        .setDescription('Points to be given to the user')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user');
    const points = interaction.options.getNumber('points');

    try {
      if (user && points) {
        const isUpdated = await updateUserPoints(user, points);

        await interaction.reply(isUpdated ?`Awarded **${points}** points to ${user}` : "Error: Failed to update the points");
        if (typeof interaction.channel ) await getUserStats(user, interaction.channel);
      }
    } catch (e) {
      console.log(e);
    }
  }
};