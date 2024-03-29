import { EmbedBuilder, User, userMention } from "discord.js";
import { GameUser } from "../../programs/user/schema";
import { Game } from "../../programs/game/schema";
import { clientId, iconURL, gameInstructions } from "../constants";
import test from "node:test";

export const createUserStatsEmbed = (user: User, userData?: GameUser) => {
  if (userData) {
    const { user, points, numberOfWins, userId } = userData;
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
      .setDescription(`Guess the Place stats for ${userMention(userId)}`)
      .addFields(
        { name: "Total Points", value: `${points}`, inline: true },
        {
          name: "Number of wins",
          value: `${numberOfWins}`,
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
      .setDescription(`Guess the Place stats for ${userMention(user.id)}`)
      .addFields({
        name: "No stats found :(",
        value: `No stats found for this user`,
      })
      .setTimestamp()
      .setFooter({ text: "Map Lovers United" });
  }
};

export const createLeaderboardEmbed = async (topTenUsers: GameUser[]) => {
  try {
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

export const createGameEmbed = (gameData: Game, revealHint?: 0 | 1) => {
  let hints = `hint #1: ${gameData.hints[0].timestamp}\nhint #2: ${gameData.hints[1].timestamp}`;
  switch (revealHint) {
    case 0:
      hints = `hint #1: ${gameData.hints[0].hint}\nhint #2: ${gameData.hints[1].timestamp}`;
      break;
    case 1:
      hints = `hint #1: ${gameData.hints[0].hint}\nhint #2: ${gameData.hints[1].hint}`;
      break;
  }

  return new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle(gameData.title)
    .setAuthor({
      name: "Guess the Place",
      iconURL,
    })
    .setDescription(gameData.description)
    .setFields(
      {
        name: "Instructions",
        value: `${gameInstructions.map((i) => `• ${i}`).join("\n")}`,
      },
      {
        name: "Hints",
        value: hints,
      }
    )
    .setImage(gameData.image)
    .setTimestamp()
    .setFooter({ text: `MLU | ${gameData.gameId}` });
};

export const createGameEndEmbed = (gameData: Game) => {
  return new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle(gameData.title)
    .setAuthor({
      name: "Guess the Place",
      iconURL,
    })
    .setDescription(
      `The answer to the last Guess the Place was ||${gameData.answer}||\n\nCongrats! To Those who found the answer. Bye for now and will be back with another Guess the Place soooon! :sloth:`
    )
    .setFields(
      {
        name: ":information_source: Leaderboard",
        value: `You can view the leaderboard using \`/leaderboard\` command from ${userMention(
          clientId
        )} You can also use \`/stats\` to view user stats.`,
      },
      {
        name: ":eyes: Experience It!",
        value: `Google Earth Web:\n[${gameData.title}](${gameData.url})`,
      }
    )
    .setImage(gameData.image)
    .setTimestamp()
    .setFooter({ text: `MLU | ${gameData.gameId}` });
};

export const createReviveEmbed = (text: string, user: User) => {
  return new EmbedBuilder()
    .setColor(0x000000)
    .setTitle("Server Revive")
    .setDescription(text)
    .setFields({
      name: "Pinged by",
      value: `${user}`,
    })
    .setTimestamp()
    .setFooter({ text: "MLU | Server Revive" });
};

export const createCookieEmbed = (user: User, cookies: number) => {
  return new EmbedBuilder()
    .setColor(0x000000)
    .setTitle(`Cookies! for ${user.username}`)
    .setDescription(
      cookies
        ? `\`${cookies}\` x :cookie:`
        : "Unfortunately, you have 0 cookies :smile:"
    )
    .setTimestamp()
    .setFooter({ text: "MLU | Cookie" });
};

export const createErrorEmbed = (err?: string) => {
  return new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(`Something went wrong :( ${err ?? `: ${err}`}`)
    .setTimestamp()
    .setFooter({ text: "MLU | Error" });
};
