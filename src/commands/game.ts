import { setTimeout as wait } from "node:timers/promises";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ButtonStyle,
} from "discord.js";
import { createNewGame, getGameData } from "../helpers";
import {
  createGameEmbed,
  createConfirmButton,
  createCreateChannelButton,
} from "../utils/create";
import { cleanUpGames, getGameStates } from "../helpers/game";

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
          option.setName("description").setDescription("Set the description")
        )
        .addStringOption((option) =>
          option.setName("title").setDescription("Title of the game")
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
      const answer = interaction.options.getString("answer") || "Answer";
      const image = interaction.options.getString("image") || "";
      const title = interaction.options.getString("title") || "Guess the Place";
      const hints = [
        interaction.options.getString("hint1") || "",
        interaction.options.getString("hint2") || "",
      ];
      const description =
        interaction.options.getString("description") ||
        "Hallo\nYet Another Guess the Place";

      try {
        const gameId = await createNewGame(
          answer,
          image,
          title,
          hints,
          description
        );
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
            await cleanUpGames();
            const confirmButtonDisabledRow = await createConfirmButton(true);
            await interaction.editReply({
              components: [confirmButtonDisabledRow],
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else if (interaction.options.getSubcommand() === "end") {
      const gameId = interaction.options.getString("id") || "";

      try {
        if (interaction.guild) {
          const gameStates = await getGameStates(gameId);
          if (gameStates) {
            for (const state of gameStates) {
              await interaction.guild.channels.delete(state.channelId);
            }
            const gameData = await getGameData(gameStates[0].gameId);
            if (gameData && interaction.channel) {
              const createChannelButtonDisabledRow =
                await createCreateChannelButton(true);
              await interaction.channel.messages.edit(gameData.messageId, {
                components: [createChannelButtonDisabledRow],
              });
            }
          }
          await interaction.reply(`Ended game with ID \`${gameId}\``);
        }
      } catch (e) {
        await interaction.reply(
          "Either the game has already been ended or I have nothing to clean :sloth:"
        );
        console.log(e);
      }
    }
  },
};
