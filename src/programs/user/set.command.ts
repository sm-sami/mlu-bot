import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";

import { updateUserPoints } from "./controllers";
import { sendChatApplicationCommandErrorEmbed } from "../../utils";

export = {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription("Give points to a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to which point is to be given")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("points")
        .setDescription("Points to be given to the user")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async handle(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");
    const points = interaction.options.getNumber("points");

    if (user && points) {
      const isUpdated = await updateUserPoints(user, points);

      await interaction.reply(
        isUpdated
          ? `Awarded **${points}** points to ${user}`
          : "Error: Failed to update the points"
      );
    } else {
      await sendChatApplicationCommandErrorEmbed(interaction);
    }
  },
};
