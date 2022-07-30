import { Db, MongoClient } from "mongodb";
import { loadConfig } from "../config";

let dbClient: MongoClient;
let db: Db;

const { dbUri, dbName } = loadConfig();

export const initializeClient = async (): Promise<MongoClient> => {
  try {
    const dbClient = await MongoClient.connect(dbUri);
    console.log(`✔️Connected to Database`);
    return dbClient;
  } catch (e) {
    throw e;
  }
};

export const getUsersDatabase = async (): Promise<Db> => {
  if (!db) {
    if (!dbClient) dbClient = await initializeClient();
    db = dbClient.db(dbName);
  }
  return db;
};
