import { Db, MongoClient } from "mongodb";
import { loadConfig } from "../config";

let db: Db;

const { dbUri, dbName } = loadConfig();

async function initializeClient(): Promise<Db> {
  const client = await MongoClient.connect(dbUri);
  return client.db(dbName);
}

const database = async (): Promise<Db> => {
  if (!db) {
    db = await initializeClient();
  }
  return db;
};

export default database;
