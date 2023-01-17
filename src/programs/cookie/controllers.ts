import { getDatabase } from "../../utils/database";
import { Snowflake, User } from "discord.js";

export const giveCookie = async (user: User): Promise<number> => {
  try {
    const db = await getDatabase();

    await db
      .collection("cookies")
      .updateOne(
        { userId: user?.id },
        { $set: { user }, $inc: { cookies: 1 } },
        { upsert: true }
      );

    return await getCookieCount(user.id);
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const getCookieCount = async (userId: Snowflake): Promise<number> => {
  try {
    const db = await getDatabase();

    const user = await db.collection("cookies").findOne({ userId });

    if (user) {
      return user.cookies;
    } else {
      return 0;
    }
  } catch (e) {
    console.log(e);
    return 0;
  }
};
