import { User } from "discord.js";
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
