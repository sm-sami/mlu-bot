import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { addChatTrigger } from "../controllers/triggers";

export = {
  data: new SlashCommandBuilder()
    .setName("trigger")
    .setDescription("To add/remove chat triggers.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("To add chat triggers")
        .addStringOption((option) =>
          option
            .setName("response")
            .setDescription("Add a response")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("trigger")
            .setDescription("Add a trigger")
            .setRequired(true)
        )
    ),

  async handle(interaction: ChatInputCommandInteraction) {
    const response = interaction.options.getString("response");
    const trigger = interaction.options.getString("trigger");

    try {
      if (response && trigger) {
        const isTriggerAdded = await addChatTrigger(trigger, response);
        if (isTriggerAdded) {
          await interaction.reply("Trigger added successfully :smile:");
          return;
        }
      }
      await interaction.reply(
        "Something went wrong, or the trigger already exists! :sloth:"
      );
    } catch (e) {
      console.error(e);
    }
  },
};
