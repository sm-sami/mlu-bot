import { v4 as getId } from "uuid";
import { getDatabase } from "../../utils/database";
import { mapHintsWithReleaseTimestamp } from "../../utils";
import { Game, GameState, Hint } from "./schema";
import { Snowflake, User } from "discord.js";

export const createNewGame = async (
  answer: string,
  image: string,
  url: string,
  title: string,
  hints: Array<string>,
  description: string,
  host: User
): Promise<string | undefined> => {
  try {
    const db = await getDatabase();
    const hintsObject = mapHintsWithReleaseTimestamp(hints);
    const gameId = getId();
    await db.collection("games").insertOne({
      gameId,
      description,
      answer,
      image,
      url,
      title,
      hints: hintsObject,
      host,
      isPosted: false,
      createdAt: new Date(),
    });

    return gameId;
  } catch (e) {
    console.log(e);
  }
};

export const getGameData = async (
  gameId: string
): Promise<Game | undefined> => {
  try {
    const db = await getDatabase();
    return JSON.parse(
      JSON.stringify(await db.collection("games").findOne({ gameId }))
    );
  } catch (e) {
    console.log(e);
  }
};

export const setPosted = async (
  gameId: string,
  messageId: Snowflake,
  threadId: Snowflake
) => {
  try {
    const db = await getDatabase();
    await db
      .collection("games")
      .updateOne({ gameId }, { $set: { isPosted: true, messageId, threadId } });
  } catch (e) {
    console.log(e);
  }
};

export const getHints = async (gameId: string): Promise<Hint[]> => {
  try {
    const db = await getDatabase();
    const { hints } = JSON.parse(
      JSON.stringify(
        await db
          .collection("games")
          .findOne({ gameId }, { projection: { _id: 0, hints: 1 } })
      )
    );
    return hints;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getGameHostId = async (gameId: string) => {
  try {
    const db = await getDatabase();
    const { host } = JSON.parse(
      JSON.stringify(
        await db
          .collection("games")
          .findOne({ gameId }, { projection: { _id: 0, host: 1 } })
      )
    );
    return host.id;
  } catch (e) {
    throw e;
  }
};

export const cleanUpGames = async () => {
  try {
    const db = await getDatabase();
    await db.collection("games").deleteMany({ isPosted: false });
  } catch (e) {
    console.log(e);
  }
};

export const saveGameState = async (
  userId: Snowflake,
  gameId: string,
  channelId: Snowflake
) => {
  try {
    const db = await getDatabase();
    await db.collection("game_state").insertOne({ userId, gameId, channelId });
  } catch (e) {
    console.log(e);
  }
};

export const doesPlayerHaveChannel = async (
  userId: Snowflake,
  gameId: string
): Promise<GameState | null> => {
  try {
    const db = await getDatabase();
    return JSON.parse(
      JSON.stringify(
        await db
          .collection("game_state")
          .findOne({ userId, gameId }, { projection: { _id: 0, channelId: 1 } })
      )
    );
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getGameStates = async (gameId: string) => {
  try {
    const db = await getDatabase();
    return JSON.parse(
      JSON.stringify(
        await db
          .collection("game_state")
          .find({ gameId }, { projection: { _id: 0 } })
          .toArray()
      )
    );
  } catch (e) {
    console.log(e);
  }
};
