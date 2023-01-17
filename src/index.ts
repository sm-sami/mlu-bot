import {
  Client,
  Events,
  GatewayIntentBits,
  InteractionType,
  ChannelType,
} from "discord.js";
import {
  handleInteractionCreate,
  handleMessageCreate,
  onReady,
} from "./events";
import { token } from "./utils/constants";

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

bot.once(Events.ClientReady, onReady);
bot.on(Events.InteractionCreate, handleInteractionCreate);
bot.on(Events.MessageCreate, handleMessageCreate);

bot.login(token).catch(() => console.error);
