import { SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { loadConfig } from "../config";

const { clientId, guildId, token } = loadConfig();

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!')
]
  .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

const deployCommands = () => {
  return rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
}

export default deployCommands;
