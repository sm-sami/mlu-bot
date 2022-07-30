import { EmbedBuilder, User, userMention } from "discord.js";
import { getUsersDatabase } from "../utils/database";

export const createUserStatsEmbed = async (user: User) => {
  try {
    const db = await getUsersDatabase();

    const userData = await db.collection("users").findOne({ userId: user.id });
    if (userData) {
      return new EmbedBuilder()
        .setColor(user.accentColor || 0x0099ff)
        .setTitle("Player Stats")
        .setThumbnail(
          `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`
        )
        .setAuthor({
          name: "Guess the Place",
          iconURL:
            "https://cdn.discordapp.com/attachments/871801727974785055/937070492366561352/outline_place_white_24dp.png",
        })
        .setDescription(
          `Guess the Place stats for ${userMention(userData.userId)}`
        )
        .addFields(
          { name: "Total Points", value: `${userData.points}`, inline: true },
          {
            name: "Number of wins",
            value: `${userData.numberOfWins}`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({ text: "Map Lovers United" });
    } else {
      return new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Player Stats")
        .setThumbnail(
          `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`
        )
        .setAuthor({
          name: "Guess the Place",
          iconURL:
            "https://cdn.discordapp.com/attachments/871801727974785055/937070492366561352/outline_place_white_24dp.png",
        })
        .setDescription(`Guess the Place stats for <@${user.id}>`)
        .addFields({
          name: "No stats found :(",
          value: `No stats found for this user`,
        })
        .setTimestamp()
        .setFooter({ text: "Map Lovers United" });
    }
  } catch (e) {
    console.error(e);
  }
};

export const createLeaderboardEmbed = async () => {
  try {
    const db = await getUsersDatabase();

    const topTenUsers = await db
      .collection("users")
      .find({}, { projection: { _id: 0, user: 0 } })
      .sort({ points: -1, numberOfWins: 1 })
      .limit(10)
      .toArray();

    const fields = [
      {
        name: "User",
        value: `${topTenUsers
          .map((user, index) => `${userMention(user.userId)}`)
          .join("\n")}`,
        inline: true,
      },
      {
        name: "Wins",
        value: `${topTenUsers
          .map((user) => `${user.numberOfWins}`)
          .join("\n")}`,
        inline: true,
      },
      {
        name: "Points",
        value: `${topTenUsers.map((user) => `${user.points}`).join("\n")}`,
        inline: true,
      },
    ];

    return new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("Leaderboard")
      .setAuthor({
        name: "Guess the Place",
        iconURL:
          "https://cdn.discordapp.com/attachments/871801727974785055/937070492366561352/outline_place_white_24dp.png",
      })
      .addFields(...fields)
      .setTimestamp()
      .setFooter({ text: "Map Lovers United" });
  } catch (e) {
    console.error(e);
  }
};
