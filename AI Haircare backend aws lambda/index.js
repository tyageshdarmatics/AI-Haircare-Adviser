import { MongoClient, ServerApiVersion } from "mongodb";

const mongoUrl = process.env.MONGO_URI;

if (!mongoUrl) {
  console.error("❌ MONGO_URI is not defined in environment variables");
}

const client = new MongoClient(mongoUrl, {
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let usersCollection = null;
let isConnected = false;

const connectDB = async (retries = 5) => {
  if (isConnected && usersCollection) return;

  if (!mongoUrl) {
    throw new Error("MONGO_URI is not set");
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔌 Trying MongoDB connect (attempt ${i + 1}/${retries})`);
      await client.connect();

      const db = client.db("derma-india");
      usersCollection = db.collection("users");

      console.log("✅ MongoDB connected!");
      isConnected = true;
      return;
    } catch (error) {
      console.error(
        `❌ MongoDB error (attempt ${i + 1}/${retries}):`,
        error.message
      );
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  throw new Error("Failed to connect to MongoDB after multiple attempts");
};

const ORIGIN = "https://main.d24eqye5uuk94e.amplifyapp.com";

const headers = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export const handler = async (event) => {
  console.log("Incoming event:", JSON.stringify(event));

  const path = event.rawPath || event.path || "/";
  const method =
    event.requestContext?.http?.method || event.httpMethod || "GET";

  // CORS preflight
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  }

  try {
    await connectDB();

    if (path === "/health" && method === "GET") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: "ok" }),
      };
    }

    if (path === "/api/users" && method === "POST") {
      let body = {};
      try {
        body = event.body ? JSON.parse(event.body) : {};
      } catch (e) {
        console.error("Invalid JSON body:", e);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Invalid JSON" }),
        };
      }

      const { name, email, phone, age } = body;

      if (!name || !email || !phone || !age) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "All fields are required" }),
        };
      }

      const result = await usersCollection.insertOne({
        name,
        email,
        phone,
        age: parseInt(age, 10),
        createdAt: new Date(),
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, id: result.insertedId }),
      };
    }

    if (path === "/api/users" && method === "GET") {
      const users = await usersCollection.find({}).toArray();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(users),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Not found", path, method }),
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Internal Server Error",
      }),
    };
  }
};
