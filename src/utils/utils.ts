import { Message, time } from "discord.js";

export const getGameIdFromEmbed = (message: Message) => {
  if (!message.embeds[0].footer) return "";
  const footer = message.embeds[0].footer.text;
  return footer.replace("MLU | ", "");
};

export const mapHintsWithReleaseTimestamp = (hints: Array<string>) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const firstHintTimestamp = time(date, "R");
  date.setDate(date.getDate() + 2);
  const secondHintTimestamp = time(date, "R");
  return [
    { hint: hints[0], ts: firstHintTimestamp },
    { hint: hints[1], ts: secondHintTimestamp },
  ];
};
