import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { TwitterApi } from 'twitter-api-v2';
import cors from 'cors';
import dotenv from 'dotenv';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const ARCHIVE_FILE = 'tweets-archive.json';

async function saveTweet(tweet) {
  try {
    const existingData = await readFile(ARCHIVE_FILE, 'utf8')
      .then(data => JSON.parse(data))
      .catch(() => ({ tweets: [] }));
    
    existingData.tweets.push(tweet);
    await writeFile(ARCHIVE_FILE, JSON.stringify(existingData));
  } catch (error) {
    console.error('Error saving tweet:', error);
  }
}

let connectedClients = 0;
let stream = null;

io.on('connection', (socket) => {
  connectedClients++;
  console.log('Client connected');

  if (connectedClients === 1) {
    startStream();
  }

  socket.on('disconnect', () => {
    connectedClients--;
    if (connectedClients === 0 && stream) {
      stream.close();
      stream = null;
    }
  });
});

async function startStream() {
  try {
    const rules = await twitterClient.v2.streamRules();
    if (rules.data?.length) {
      await twitterClient.v2.updateStreamRules({
        delete: { ids: rules.data.map(rule => rule.id) }
      });
    }

    await twitterClient.v2.updateStreamRules({
      add: [
        { value: '#journorequest OR #prrequest' }
      ]
    });

    stream = await twitterClient.v2.searchStream({
      'tweet.fields': ['created_at', 'author_id', 'text'],
      'user.fields': ['username', 'name', 'profile_image_url']
    });

    stream.on('data', async tweet => {
      await saveTweet(tweet);
      io.emit('tweet', tweet);
    });

  } catch (error) {
    console.error('Error starting stream:', error);
  }
}

app.get('/api/tweets', async (req, res) => {
  try {
    const data = await readFile(ARCHIVE_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Error reading tweets' });
  }
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});