import { ChannelType, Message } from "discord.js";
import { getReplyToChatTrigger } from "../programs/triggers";

export const handleMessageCreate = async (message: Message) => {
  if (message.author.bot) return;

  switch (message.channel.type) {
    case ChannelType.GuildText:
      await handleGuildTextMessage(message);
      break;
  }
};

const handleGuildTextMessage = async (message: Message) => {
  try {
    const response = await getReplyToChatTrigger(message);
    if (response) await message.reply(response);
  } catch (e) {
    console.log(e);
  }
};
