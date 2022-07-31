import { setTimeout as wait } from "node:timers/promises";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ButtonStyle,
} from "discord.js";
import { createNewGame } from "../helpers";
import { createGameEmbed, createConfirmButton } from "../utils/create";

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
          option.setName("image").setDescription("Image url").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("hint1").setDescription("Hint #1").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("hint2").setDescription("Hint #2").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("title").setDescription("Title of the game")
        )
    ),

  async handle(interaction: ChatInputCommandInteraction) {
    const image = interaction.options.getString("image") || "";
    const title = interaction.options.getString("title") || "Guess the Place";
    const hints = [
      interaction.options.getString("hint1") || "",
      interaction.options.getString("hint2") || "",
    ];

    try {
      const gameId = await createNewGame(image, title, hints);
      if (gameId) {
        const gameEmbed = await createGameEmbed(gameId);
        const confirmButtonRow = await createConfirmButton();

        if (gameEmbed && confirmButtonRow) {
          await interaction.reply({
            content: `Do you want to post this?`,
            embeds: [gameEmbed],
            ephemeral: true,
            components: [confirmButtonRow],
          });
          await wait(1000 * 60 * 10);
          const confirmButtonDisabledRow = await createConfirmButton(true);
          await interaction.editReply({
            components: [confirmButtonDisabledRow],
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  },
};
