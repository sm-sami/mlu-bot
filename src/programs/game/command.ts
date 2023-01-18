import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ButtonStyle,
} from "discord.js";

import { endGame, sendPreviewEmbed } from "./";
import { createNewGame } from "./controllers";
import { sendChatApplicationCommandErrorEmbed } from "../../utils";

export = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("To start/end Guess the Place")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("To start a new Guess the Place instance")
        .addStringOption((option) =>
          option
            .setName("answer")
            .setDescription("The answer to the Guess the Place")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("image").setDescription("Image url").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("hint1").setDescription("Hint #1").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("hint2").setDescription("Hint #2").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("Google earth URL")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("description").setDescription("Set the description")
        )
        .addStringOption((option) =>
          option.setName("title").setDescription("Title of the game")
        )
        .addUserOption((option) =>
          option.setName("host").setDescription("The host of this game")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("end")
        .setDescription("To end a Guess the Place")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the game instance")
            .setRequired(true)
        )
    ),

  async handle(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === "create") {
      const answer = interaction.options.getString("answer") || "";
      const image = interaction.options.getString("image") || "";
      const title = interaction.options.getString("title") || "Guess the Place";
      const hints = [
        interaction.options.getString("hint1") || "",
        interaction.options.getString("hint2") || "",
      ];
      const url = interaction.options.getString("url") || "";
      const description =
        interaction.options.getString("description") ||
        "Hallo\nYet Another Guess the Place";
      const host = interaction.options.getUser("host") || interaction.user;

      const gameId = await createNewGame(
        answer,
        image,
        url,
        title,
        hints,
        description,
        host
      );
      if (!gameId) {
        await sendChatApplicationCommandErrorEmbed(
          interaction,
          "Error creating game"
        );
        return;
      }
      await sendPreviewEmbed(interaction, gameId);
    } else if (interaction.options.getSubcommand() === "end") {
      const gameId = interaction.options.getString("id") || "";
      await endGame(interaction, gameId);
      await interaction.followUp({
        content: `Ended game with ID \`${gameId}\``,
        ephemeral: true,
      });
    }
  },
};
