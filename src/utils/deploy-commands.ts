import fs from 'node:fs';
import path from "node:path";
import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { loadConfig } from "../config";

const { clientId, guildId, token } = loadConfig();

export const commands: any = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath)

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

const deployCommands = () => {
  return rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
}

export default deployCommands;
