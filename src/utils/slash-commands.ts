import fs from "node:fs";
import path from "node:path";
import {
  Collection,
  Interaction,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { REST } from "@discordjs/rest";
import { clientId, guildId, token } from "./constants";

const commands: Array<JSON> = [];
const bot_commands = new Collection<string, Command>();

interface Command {
  data: SlashCommandBuilder;
  handle: (interaction: Interaction) => Promise<void>;
}

export const loadCommands = () => {
  const programsPath = path.join(__dirname, "../programs");
  const programs = fs.readdirSync(programsPath);

  const files = programs
    .filter((file) => file.endsWith("command.js"))
    .map((file) => path.join(programsPath, file));

  const otherPrograms = programs.filter((file) => !file.endsWith(".js"));
  for (const program of otherPrograms) {
    const commandPath = path.join(programsPath, program);
    const directoryFiles = fs.readdirSync(commandPath);
    const command = directoryFiles
      .filter((file) => file.endsWith("command.js"))
      .map((file) => path.join(commandPath, file));
    files.push(...command);
  }

  for (const file of files) {
    const command = require(file);
    bot_commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }
};

export const deployCommands = async () => {
  const rest = new REST({ version: "10" }).setToken(token);
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log("✅  Registered All Commands!");
  } catch (e) {
    throw e;
  }
};

export { bot_commands as commands };
