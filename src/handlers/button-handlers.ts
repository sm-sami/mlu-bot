import { setTimeout as wait } from "node:timers/promises";
import { ButtonInteraction, roleMention } from "discord.js";
import { cleanUpGames, setPosted } from "../helpers/game";
import { createConfirmButton, createGameEmbed } from "../utils/create";
import { chatGamesRole } from "../utils/constants";
import { getGameIdFromEmbed } from "../utils";

export const handleConfirmButton = async (interaction: ButtonInteraction) => {
  await interaction.deferUpdate();
  let gameEmbed = await createGameEmbed();

  if (interaction.channel) {
    const message = await interaction.channel.send({
      content: `${roleMention(chatGamesRole)}`,
      embeds: [gameEmbed!],
    });
    const confirmButtonDisabledRow = await createConfirmButton(true);
    await interaction.editReply({ components: [confirmButtonDisabledRow] });
    await interaction.followUp({
      content: "New Guess the Place posted successfully!  :smile:",
      ephemeral: true,
    });

    if (message) {
      await setPosted(getGameIdFromEmbed(message));
      await cleanUpGames();
      await wait(1000 * 60 * 60 * 24);
      gameEmbed = await createGameEmbed(getGameIdFromEmbed(message), 0);
      message.edit({ embeds: [gameEmbed!] });
      await wait(3000);
      gameEmbed = await createGameEmbed(getGameIdFromEmbed(message), 1);
      message.edit({ embeds: [gameEmbed!] });
    }
  }
};
