import { Db, MongoClient } from "mongodb";
import { dbUri, dbName } from "./constants";

let dbClient: MongoClient;
let db: Db;

export const initializeClient = async (): Promise<MongoClient> => {
  try {
    const dbClient = await MongoClient.connect(dbUri);
    console.log(`✔️Connected to Database`);
    return dbClient;
  } catch (e) {
    throw e;
  }
};

export const getDatabase = async (): Promise<Db> => {
  if (!db) {
    if (!dbClient) dbClient = await initializeClient();
    db = dbClient.db(dbName);
  }
  return db;
};
