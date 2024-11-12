import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';

export const dynamic = 'force-dynamic';

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

let io: SocketIOServer | null = null;

export async function GET(req: Request, res: NextApiResponse) {
  if (!io) {
    const server = res.socket?.server as unknown as NetServer;
    io = new SocketIOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    io.on('connection', async (socket) => {
      console.log('Client connected');

      const stream = await twitterClient.v2.searchStream({
        'tweet.fields': ['created_at', 'author_id', 'text'],
        'user.fields': ['username', 'name', 'profile_image_url'],
      });

      stream.on('data', (tweet) => {
        socket.emit('tweet', tweet);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
        stream.close();
      });
    });
  }

  return new Response('Socket initialized', { status: 200 });
}