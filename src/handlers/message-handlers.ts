import { Message } from "discord.js";

export const handleGuildTextMessage = async (message: Message) => {
  const regex = /muhammad/i;
  if (regex.test(message.content)) {
    await message.reply("Hi, how can I help you? :smile:");
  }
};
