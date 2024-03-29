import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const createConfirmButton = (isDisabled?: boolean) => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("confirm-post")
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("✅")
      .setDisabled(isDisabled ?? false)
  );
};

export const createCreateChannelButton = (isDisabled?: boolean) => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("create-channel")
      .setLabel("Take a Guess")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("❓")
      .setDisabled(isDisabled ?? false)
  );
};
