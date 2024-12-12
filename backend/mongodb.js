import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

let client
let clientPromise

if(!uri) {
    throw new Error("Please add your Mongo URI to .env");
}

if(process.env.NODE_ENV === 'development') {
    if(!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export const getDataBase = async (comment_section) => {
    const connectedClient = await clientPromise;
    return connectedClient.db(comment_section);
}

export default clientPromise;