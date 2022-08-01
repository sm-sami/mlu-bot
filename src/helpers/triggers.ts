import { v4 as getId } from "uuid";
import { getDatabase } from "../utils/database";

export const loadChatTriggers = async () => {
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

export const addChatTrigger = async (
  triggers: Array<string>,
  response: string
) => {
  try {
    const db = await getDatabase();
    const { insertedId } = await db
      .collection("triggers")
      .insertOne({ triggerId: getId(), triggers, response });
    return !!insertedId;
  } catch (e) {
    console.log(e);
  }
};
