import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const createConfirmButton = async (isDisabled?: boolean) => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("confirm-post")
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("✅")
      .setDisabled(isDisabled ?? false)
  );
};
