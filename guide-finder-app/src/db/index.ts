import { MongoClient } from 'mongodb';

const uri = 'your_mongodb_connection_string';
const client = new MongoClient(uri);
const dbName = 'guideFinderDB';
let db;

export const initializeDatabase = async () => {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

export const getGuides = async () => {
    try {
        const guidesCollection = db.collection('guides');
        return await guidesCollection.find({}).toArray();
    } catch (error) {
        console.error('Error fetching guides:', error);
        throw error;
    }
};