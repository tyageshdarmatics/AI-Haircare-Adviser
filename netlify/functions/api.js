import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import serverless from 'serverless-http';

const app = express();
app.use(express.json());

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// MongoDB Atlas connection
// Added .trim() and stripped surrounding quotes in case they were accidentally included in the Netlify dashboard
const rawUri = process.env.MONGO_URI || '';
const MONGO_URI = rawUri.trim().replace(/^["']|["']$/g, '');
const DB_NAME = 'skincare-haircare-database';
const COLLECTION_NAME = 'users';

let cachedClient = null;
let usersCollection = null;

const connectDB = async () => {
    if (cachedClient && usersCollection) {
        return usersCollection;
    }
    if (!MONGO_URI || MONGO_URI === 'undefined' || MONGO_URI === 'null') {
        throw new Error('MONGO_URI environment variable is missing or literally "undefined" in Netlify settings.');
    }

    // Explicit scheme check to throw a much clearer error
    if (!MONGO_URI.startsWith('mongodb://') && !MONGO_URI.startsWith('mongodb+srv://')) {
        const prefix = MONGO_URI.substring(0, 15);
        throw new Error(`The MONGO_URI in Netlify has an invalid start value: "${prefix}...". It MUST start with "mongodb://" or "mongodb+srv://". Did you make a typo?`);
    }

    const client = new MongoClient(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    const db = client.db(DB_NAME);
    cachedClient = client;
    usersCollection = db.collection(COLLECTION_NAME);

    // Enforce uniqueness constraints at the DB level
    try {
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        await usersCollection.createIndex({ phone: 1 }, { unique: true });
    } catch (indexErr) {
        console.log("Indexes might already exist or failed:", indexErr.message);
    }

    console.log(`✅ MongoDB connected! DB: ${DB_NAME}, Collection: ${COLLECTION_NAME}`);
    return usersCollection;
};

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: DB_NAME, collection: COLLECTION_NAME });
});

app.post('/api/users', async (req, res) => {
    try {
        const { name, email, phone, age } = req.body;

        if (!name || !email || !phone || !age) {
            return res.status(400).json({ error: 'All fields (name, email, phone, age) are required.' });
        }

        const collection = await connectDB();

        // 1. Check for duplicates / Authentication
        const existingUser = await collection.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            // Ensure full match for returning user (Authentication Simulation)
            if (existingUser.name === name && existingUser.age === parseInt(age, 10)) {
                return res.json({
                    success: true,
                    id: existingUser._id,
                    isReturning: true,
                    message: "Welcome back!",
                    history: existingUser.history || []
                });
            } else {
                // Different identity with same phone/email
                return res.status(400).json({ error: 'This mobile number or email ID is already registered.' });
            }
        }

        // 2. Insert new user
        const result = await collection.insertOne({
            name,
            email,
            phone,
            age: parseInt(age, 10),
            createdAt: new Date(),
            history: [] // Init empty historical data
        });

        res.json({ success: true, id: result.insertedId, isReturning: false, history: [] });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const collection = await connectDB();
        const users = await collection.find({}).sort({ createdAt: -1 }).toArray();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

// Store full session data at the end of the user flow
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sessionData = req.body;

        if (!id) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        const collection = await connectDB();

        // Push new session data into the history array
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $push: {
                    history: {
                        date: new Date(),
                        ...sessionData
                    }
                },
                $set: { lastActiveAt: new Date() }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ success: true, message: 'Data saved securely to history.' });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/count', async (req, res) => {
    try {
        const collection = await connectDB();
        const count = await collection.countDocuments({});
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export const handler = serverless(app);
