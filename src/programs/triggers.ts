import { Message } from "discord.js";
import { getChatTriggers } from "../controllers";
import { Trigger, TriggersWithResponse } from "../types/triggers";

let triggers: Array<TriggersWithResponse>;
let lastUpdated: number;

export const loadChatTriggers = async () => {
  if (!lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 30) {
    triggers = (await getChatTriggers()) || [];
    console.log("✔️Loaded Chat Triggers");
    lastUpdated = Date.now();
  }
  return triggers;
};

export const getReplyToChatTrigger = async (message: Message) => {
  const triggers = await loadChatTriggers();
  for (const data of triggers) {
    if (
      data.triggers.some((trigger: Trigger) =>
        message.content.toLowerCase().includes(trigger.trigger)
      )
    )
      return data.response;
  }
};
