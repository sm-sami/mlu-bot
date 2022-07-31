import { EmbedBuilder, User, time, userMention } from "discord.js";
import { iconURL, gameInstructions } from "../constants";
import { getTopTenUsers, getUserData } from "../../helpers";
import { getGameData } from "../../helpers";

export const createUserStatsEmbed = async (user: User) => {
  try {
    const userData = await getUserData(user);

    if (userData) {
      return new EmbedBuilder()
        .setColor(user.accentColor || 0x0099ff)
        .setTitle("Player Stats")
        .setThumbnail(
          `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`
        )
        .setAuthor({
          name: "Guess the Place",
          iconURL,
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
    const topTenUsers = await getTopTenUsers();

    const fields = [
      {
        name: "User",
        value: `${topTenUsers
          .map((user) => `${userMention(user.userId)}`)
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
        iconURL,
      })
      .addFields(...fields)
      .setTimestamp()
      .setFooter({ text: "Map Lovers United" });
  } catch (e) {
    console.error(e);
  }
};

export const createGameEmbed = async (gameId: number) => {
  try {
    const gameData = await getGameData(gameId);

    const date = new Date();
    date.setDate(date.getDate() + 1);

    return new EmbedBuilder()
      .setColor(0xffffff)
      .setTitle(gameData!.title)
      .setAuthor({
        name: "Guess the Place",
        iconURL,
      })
      .setFields(
        {
          name: "Instructions",
          value: `${gameInstructions.map((i) => `• ${i}`).join("\n")}`,
        },
        {
          name: "Hints",
          value: `hint #1: ${time(date, "R")}\nhint #2: ${gameData!.hints[1]}`,
        }
      )
      .setImage(gameData!.image)
      .setTimestamp()
      .setFooter({ text: "Map Lovers United" });
  } catch (e) {
    console.error(e);
  }
};
