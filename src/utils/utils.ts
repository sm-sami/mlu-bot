import { ChatInputCommandInteraction, Message, time } from "discord.js";
import { createErrorEmbed } from "./create";
import { Document } from "mongodb";
import { Hint } from "../programs/game/schema";

export const getGameIdFromEmbed = (message: Message): string => {
  if (!message.embeds[0].footer) return "";
  return message.embeds[0].footer.text.replace("MLU | ", "");
};

export const sendChatApplicationCommandErrorEmbed = async (
  interaction: ChatInputCommandInteraction,
  err?: string,
  ephemeral?: boolean
) => {
  const errorEmbed = createErrorEmbed(err);
  await interaction.reply({
    embeds: [errorEmbed],
    ephemeral: ephemeral ?? true,
  });
};

export const mapHintsWithReleaseTimestamp = (
  hints: Array<string>
): Array<Hint> => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const firstHintTimestamp = time(date, "R");
  date.setDate(date.getDate() + 2);
  const secondHintTimestamp = time(date, "R");
  return [
    { hint: hints[0], timestamp: firstHintTimestamp },
    { hint: hints[1], timestamp: secondHintTimestamp },
  ];
};

export const mongoDocumentsToJSON = (documents: Array<Document>) =>
  JSON.parse(JSON.stringify(documents));
