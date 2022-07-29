import { EmbedBuilder, User, TextBasedChannel} from "discord.js";
import { database } from "../utils";

export const updateUserPoints = async (user: User, points: number) => {
  try {
    const db = await database();

    const { modifiedCount, upsertedCount }  = await db.collection("users")
      .updateOne(
        { userId: user?.id },
        { $set: { user }, $inc: { points, numberOfWins: 1 } },
        { upsert: true}
      )

    return modifiedCount || upsertedCount;
  } catch (e) {
    console.error(e);
  }
}

export const getUserStats = async (user: User, channel: TextBasedChannel|null) => {
  const db = await database();

  const userData = await db.collection("users").findOne({ userId: user.id })
  if (userData) {
    try {
      const playerStats = new EmbedBuilder()
        .setColor(userData.accentColor || 0x0099FF)
        .setTitle('Player Stats')
        .setThumbnail(`https://cdn.discordapp.com/avatars/${userData.userId}/${userData.user.avatar}.webp`)
        .setAuthor({ name: 'Guess the Place', iconURL: 'https://cdn.discordapp.com/attachments/871801727974785055/937070492366561352/outline_place_white_24dp.png' })
        .setDescription(`Guess the Place stats for <@${userData!.userId}>`)
        .addFields(
          { name: 'Total Points', value: `${userData.points}`, inline: true },
          { name: 'Number of wins', value: `${userData.numberOfWins}`, inline:true }
        )
        .setTimestamp()
        .setFooter({ text: 'Map Lovers United'});

      if (typeof channel !== null) await channel!.send({ embeds: [playerStats] })
    } catch (e) {
      console.error(e);
    }
  } else {
    await channel!.send('No stats were found for the given user');
  }
}