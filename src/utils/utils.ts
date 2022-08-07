import { Message, time } from "discord.js";
import { Document } from "mongodb";
import { Hint } from "../types/game";

export const getGameIdFromEmbed = (message: Message): string => {
  if (!message.embeds[0].footer) return "";
  return message.embeds[0].footer.text.replace("MLU | ", "");
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

export const mongoDocumentsToJSON = (documents: Document | Array<Document>) =>
  JSON.parse(JSON.stringify(documents));
