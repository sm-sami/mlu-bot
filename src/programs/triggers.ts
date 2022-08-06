import { Message } from "discord.js";
import { getChatTriggers } from "../controllers/triggers";

let triggerData: any;
let lastUpdated: number;

export const loadChatTriggers = async () => {
  if (!lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 30) {
    triggerData = await getChatTriggers();
    console.log("✔️Loaded Chat Triggers");
    lastUpdated = Date.now();
  }
  return triggerData;
};

export const getReplyToChatTrigger = async (message: Message) => {
  const triggerData = await loadChatTriggers();
  for (const data of triggerData) {
    if (
      data.triggers.some((trigger: { triggerId: string; trigger: string }) =>
        trigger.trigger.includes(message.content.toLowerCase())
      )
    ) return data.response;
  }
};
