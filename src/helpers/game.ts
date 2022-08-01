import { v4 as getId } from "uuid";
import { getDatabase } from "../utils/database";
import { mapHintsWithReleaseTimestamp } from "../utils";
import { User } from "discord.js";

export const createNewGame = async (
  image: string,
  title: string,
  hints: Array<string>
) => {
  try {
    const db = await getDatabase();

    const hintsObject = mapHintsWithReleaseTimestamp(hints);

    const gameId = getId();
    await db.collection("games").insertOne({
      gameId,
      image,
      title,
      hints: hintsObject,
      isPosted: false,
      createdAt: new Date(),
    });

    return gameId;
  } catch (e) {
    console.log(e);
  }
};

export const getGameData = async (gameId?: string) => {
  try {
    const db = await getDatabase();
    if (gameId) return await db.collection("games").findOne({ gameId });

    const [gameData] = await db
      .collection("games")
      .find({ isPosted: false })
      .sort({ createdAt: -1 })
      .toArray();
    return gameData;
  } catch (e) {
    console.log(e);
  }
};

export const setPosted = async (gameId: string) => {
  try {
    const db = await getDatabase();

    await db
      .collection("games")
      .updateOne({ gameId }, { $set: { isPosted: true } });
  } catch (e) {
    console.log(e);
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
  userId: string,
  gameId: string,
  channelId: string
) => {
  try {
    const db = await getDatabase();

    await db.collection("game_state").insertOne({ userId, gameId, channelId });
  } catch (e) {
    console.log(e);
  }
};

export const doesPlayerHaveChannel = async (userId: string, gameId: string) => {
  try {
    const db = await getDatabase();

    return await db
      .collection("game_state")
      .findOne({ userId, gameId }, { projection: { _id: 0, channelId: 1 } });
  } catch (e) {
    console.log(e);
  }
};
