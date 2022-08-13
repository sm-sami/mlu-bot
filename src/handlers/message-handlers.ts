import { Message } from "discord.js";
import { getReplyToChatTrigger } from "../programs/triggers";

export const handleGuildTextMessage = async (message: Message) => {
  try {
    const response = await getReplyToChatTrigger(message);
    if (response) await message.reply(response);
  } catch (e) {
    console.log(e);
  }
};
