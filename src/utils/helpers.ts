import { EmbedBuilder, User } from "discord.js";
import { database } from "./index";

export const createUserStatsEmbed = async (user: User) => {
  try {
    const db = await database();

    const userData = await db.collection("users").findOne({ userId: user.id })
    if (userData) {
      return new EmbedBuilder()
        .setColor(user.accentColor || 0x0099FF)
        .setTitle('Player Stats')
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`)
        .setAuthor({ name: 'Guess the Place', iconURL: 'https://cdn.discordapp.com/attachments/871801727974785055/937070492366561352/outline_place_white_24dp.png' })
        .setDescription(`Guess the Place stats for <@${userData!.userId}>`)
        .addFields(
          { name: 'Total Points', value: `${userData.points}`, inline: true },
          { name: 'Number of wins', value: `${userData.numberOfWins}`, inline:true }
        )
        .setTimestamp()
        .setFooter({ text: 'Map Lovers United'});
    }

    else {
      return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Player Stats')
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`)
        .setAuthor({
          name: 'Guess the Place',
          iconURL: 'https://cdn.discordapp.com/attachments/871801727974785055/937070492366561352/outline_place_white_24dp.png'
        })
        .setDescription(`Guess the Place stats for <@${user.id}>`)
        .addFields(
          {name: 'No stats found :(', value: `No stats found for this user`}
        )
        .setTimestamp()
        .setFooter({text: 'Map Lovers United'});
    }

  } catch (e) {
    console.error(e);
  }
}