import { User } from "discord.js";
import { getDatabase } from "../utils/database";

export const updateUserPoints = async (user: User, points: number) => {
  try {
    const db = await getDatabase();
    const { modifiedCount, upsertedCount } = await db
      .collection("users")
      .updateOne(
        { userId: user?.id },
        { $set: { user }, $inc: { points, numberOfWins: 1 } },
        { upsert: true }
      );
    return modifiedCount || upsertedCount;
  } catch (e) {
    console.error(e);
  }
};

export const getUserData = async (user: User) => {
  try {
    const db = await getDatabase();
    return await db.collection("users").findOne({ userId: user.id });
  } catch (e) {
    console.log(e);
  }
};

export const getTopTenUsers = async () => {
  try {
    const db = await getDatabase();
    return await db
      .collection("users")
      .find({}, { projection: { _id: 0, user: 0 } })
      .sort({ points: -1, numberOfWins: 1 })
      .limit(10)
      .toArray();
  } catch (e) {
    console.log(e);
    return [];
  }
};
