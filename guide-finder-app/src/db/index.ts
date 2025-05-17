import { MongoClient } from "mongodb";
import type { Db } from "mongodb";
import type { Guide } from "../types/guide";

const uri = "your_mongodb_connection_string";
const client = new MongoClient(uri);
const dbName = "guideFinderDB";
let db: Db;

export const initializeDatabase = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export const getGuides = async () => {
  try {
    const guidesCollection = db.collection("guides");
    return await guidesCollection.find({}).toArray();
  } catch (error) {
    console.error("Error fetching guides:", error);
    throw error;
  }
};

export const addGuideToDb = async (guide: Guide) => {
  try {
    const guidesCollection = db.collection("guides");
    await guidesCollection.insertOne(guide);
  } catch (error) {
    console.error("Error adding guide:", error);
    throw error;
  }
};

export const updateGuideInDb = async (guide: Guide) => {
  try {
    const guidesCollection = db.collection("guides");
    await guidesCollection.updateOne(
      { id: guide.id },
      {
        $set: {
          title: guide.title,
          description: guide.description,
          steps: guide.steps,
        },
      }
    );
  } catch (error) {
    console.error("Error updating guide:", error);
    throw error;
  }
};

export const deleteGuideFromDb = async (id: string) => {
  try {
    const guidesCollection = db.collection("guides");
    await guidesCollection.deleteOne({ id });
  } catch (error) {
    console.error("Error deleting guide:", error);
    throw error;
  }
};
