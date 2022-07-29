import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    await interaction.editReply(
      `Pong! Round-trip latency: ${
        sent.createdTimestamp - interaction.createdTimestamp
      }ms`
    );
  },
};
