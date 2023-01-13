import { EmbedBuilder, User, userMention } from "discord.js";
import { getGameData } from "../../programs/game";
import { getTopTenUsers, getUserData } from "../../programs/user";
import { clientId, iconURL, gameInstructions } from "../constants";

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

export const createGameEmbed = async (gameId: string, revealHint?: 0 | 1) => {
  try {
    const gameData = await getGameData(gameId);

    if (gameData) {
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
    }
  } catch (e) {
    console.error(e);
  }
};

export const createGameEndEmbed = async (gameId: string) => {
  try {
    const gameData = await getGameData(gameId);

    if (gameData) {
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
    }
  } catch (e) {
    console.error(e);
  }
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
