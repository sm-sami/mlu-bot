import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";

import { addChatTrigger, deleteChatTrigger } from "./controllers";
import { sendChatApplicationCommandErrorEmbed } from "../../utils";

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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("To delete a trigger")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the trigger")
            .setRequired(true)
        )
    ),

  async handle(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === "add") {
      const response = interaction.options.getString("response");
      const trigger = interaction.options.getString("trigger");

      if (response && trigger) {
        const isTriggerAdded = await addChatTrigger(trigger, response);
        if (isTriggerAdded) {
          await interaction.reply("Trigger added successfully :smile:");
          return;
        }
      }
      await sendChatApplicationCommandErrorEmbed(
        interaction,
        "the trigger might already exist!, try again :sloth:",
        false
      );
    } else if (interaction.options.getSubcommand() === "delete") {
      const triggerId = interaction.options.getString("id");

      if (triggerId) {
        const isDeleted = await deleteChatTrigger(triggerId);
        if (isDeleted)
          await interaction.reply("Trigger deleted successfully! :smile:");
        else
          await sendChatApplicationCommandErrorEmbed(
            interaction,
            "is the triggerId a valid one?",
            false
          );
      }
    }
  },
};
