import { v4 as getId } from "uuid";
import { getDatabase } from "../utils/database";

export const getChatTriggers = async () => {
  try {
    const db = await getDatabase();
    return await db
      .collection("triggers")
      .find({}, { projection: { _id: 0 } })
      .toArray();
  } catch (e) {
    console.log(e);
  }
};

export const addChatTrigger = async (trigger: string, response: string) => {
  try {
    const db = await getDatabase();
    const triggerData = await db
      .collection("triggers")
      .findOne({ response, triggers: { $elemMatch: { trigger } } });
    if (!triggerData) {
      const { modifiedCount, upsertedCount } = await db
        .collection("triggers")
        .updateOne(
          { response },
          { $push: { triggers: { triggerId: getId(), trigger } } },
          { upsert: true }
        );
      return modifiedCount || upsertedCount;
    }
  } catch (e) {
    console.log(e);
  }
};
