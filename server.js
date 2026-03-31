import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from same directory as server.js (the project root)
dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('🔥 UNHANDLED REJECTION:', reason);
});

const app = express();
app.use(express.json());
app.use(cors());

// Use MONGO_URI from environment (set via App Runner or .env locally)
const rawUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const mongoUrl = rawUri.split('/Hair-analysis-database')[0];

const port = process.env.PORT || 8080;
let client;
let usersCollection;

const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (!client) {
        client = new MongoClient(mongoUrl);
      }
      await client.connect();
      const db = client.db('Hair-analysis-database');
      usersCollection = db.collection('Hair-analysis');
      console.log('✅ MongoDB connected! DB: Hair-analysis-database, Collection: Hair-analysis');
      return true;
    } catch (error) {
      console.error(`❌ MongoDB connection error (attempt ${i + 1}/${retries}):`, error.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  console.error('❌ MongoDB connection failed after all retries');
  return false;
};

connectDB();

// Health check — required by App Runner
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone, age } = req.body;

    if (!name || !email || !phone || !age) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) {
      return res.status(400).json({ error: 'Age must be between 1 and 100' });
    }

    const existingUser = await usersCollection.findOne({
      $or: [{ email: email }, { phone: phone }]
    });

    if (existingUser) {
      if (existingUser.name.trim().toLowerCase() !== name.trim().toLowerCase()) {
        return res.status(400).json({
          error: `A user with this email or phone already exists with a different name (${existingUser.name}).`
        });
      }
      return res.json({
        success: true,
        id: existingUser._id,
        isReturning: true,
        history: existingUser.history || []
      });
    }

    const result = await usersCollection.insertOne({
      name,
      email,
      phone,
      age: ageNum,
      createdAt: new Date(),
      history: []
    });

    res.json({ success: true, id: result.insertedId, isReturning: false });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId, ...sessionData } = req.body;
    const { ObjectId } = await import('mongodb');

    if (sessionId) {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      if (user && user.history) {
        const sessionIndex = user.history.findIndex(h => h.sessionId === sessionId);
        if (sessionIndex !== -1) {
          const updateQuery = {};
          updateQuery[`history.${sessionIndex}`] = {
            ...user.history[sessionIndex],
            ...sessionData,
            lastUpdated: new Date()
          };
          await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateQuery, lastActiveAt: new Date() } }
          );
          console.log(`Updated session ${sessionId} for user ${id}`);
          return res.json({ success: true, updated: true });
        }
      }
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          history: {
            sessionId: sessionId || Date.now().toString(),
            ...sessionData,
            date: new Date()
          }
        },
        $set: { lastActiveAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, added: true });
  } catch (error) {
    console.error('Error updating user history:', error);
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

app.get('/api/users/count', async (req, res) => {
  try {
    const count = await usersCollection.countDocuments({});
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve runtime config back to frontend (Vite build on App Runner lacks env vars)
app.get('/api/config', (req, res) => {
  res.json({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.VITE_API_KEY || process.env.API_KEY || ''
  });
});

// Serve React frontend build — dist/ is in the same root directory
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.warn('⚠️ dist/ not found. Running in API-only mode.');
  app.get('/', (req, res) => {
    res.send('API is running. Frontend build not found.');
  });
}

// Always listen — required for App Runner (not Lambda)
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
