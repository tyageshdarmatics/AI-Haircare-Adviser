import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const mongoUrl = process.env.MONGO_URI;
const client = new MongoClient(mongoUrl);
let usersCollection;

const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await client.connect();
      const db = client.db('derma-india');
      usersCollection = db.collection('users');
      console.log('✅ MongoDB connected!');
      return true;
    } catch (error) {
      console.error(`❌ MongoDB error (attempt ${i + 1}/${retries}):`, error.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  return false;
};

connectDB();

app.options('*', cors());

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone, age } = req.body;

    if (!name || !email || !phone || !age) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await usersCollection.insertOne({
      name,
      email,
      phone,
      age: parseInt(age),
      createdAt: new Date(),
    });

    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  return new Promise((resolve, reject) => {
    app(event, context, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
