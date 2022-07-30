import { Db, MongoClient } from "mongodb";
import { loadConfig } from "../config";

let db: Db;

const { dbUri, dbName } = loadConfig();

async function initializeClient(): Promise<Db> {
  try {
    const client = await MongoClient.connect(dbUri);
    console.log(`✔️Connected to Database`);
    return client.db(dbName);
  } catch (e) {
    throw e;
  }
}

const database = async (): Promise<Db> => {
  if (!db) {
    db = await initializeClient();
  }
  return db;
};

export default database;
