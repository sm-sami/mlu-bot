import fs from "node:fs";
import path from "node:path";

import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";

import { clientId, guildId, token } from "./constants";

export const commands: Array<JSON> = [];

const commandsPath = path.join(__dirname, "../commands");
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

export const deployCommands = async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log(`✔️Registered All Commands!`);
  } catch (e) {
    throw e;
  }
};
