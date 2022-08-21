import { Message } from "discord.js";
import { getChatTriggers } from "./controllers";
import { Trigger, TriggersWithResponse } from "./schema";

let index: Array<TriggersWithResponse>;
let lastUpdated: number;

export const loadChatTriggers = async () => {
  if (!lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 30) {
    index = (await getChatTriggers()) || [];
    console.log("✔️Loaded Chat Triggers");
    lastUpdated = Date.now();
  }
  return index;
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
