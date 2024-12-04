import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://patrickfish10:Gatupu24@cluster0.ueln5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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