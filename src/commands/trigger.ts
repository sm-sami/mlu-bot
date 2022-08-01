import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { addChatTrigger, loadChatTriggers } from "../helpers/triggers";

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
            .setName("trigger1")
            .setDescription("Add a trigger")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("trigger2").setDescription("Add another trigger")
        )
        .addStringOption((option) =>
          option.setName("trigger3").setDescription("Add another trigger")
        )
    ),

  async handle(interaction: ChatInputCommandInteraction) {
    const response = interaction.options.getString("response");
    const triggers = [...Array(3)]
      .map((_, index) => interaction.options.getString(`trigger${index + 1}`))
      .filter(Boolean);

    try {
      if (response) {
        const isTriggerAdded = await addChatTrigger(
          triggers as Array<string>,
          response
        );
        if (isTriggerAdded)
          await interaction.reply("Trigger added successfully :smile:");
        return;
      }

      await interaction.reply("Something went wrong :pensive:");
    } catch (e) {
      console.error(e);
    }
  },
};
