import { NextResponse } from 'next/server';

const TWITTER_API_URL = 'https://api.twitter.com/2/tweets/search/recent';
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

export async function GET() {
  try {
    const query = encodeURIComponent('#journorequest OR #prrequest -is:retweet');
    const url = `${TWITTER_API_URL}?query=${query}&max_results=20&tweet.fields=created_at,public_metrics&expansions=author_id&user.fields=name,username,profile_image_url`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Twitter API request failed');
    }

    const data = await response.json();

    // Transform the data to match our Tweet interface
    const tweets = data.data.map((tweet: any) => {
      const author = data.includes.users.find((user: any) => user.id === tweet.author_id);
      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        public_metrics: tweet.public_metrics,
        author: {
          name: author.name,
          username: author.username,
          profile_image_url: author.profile_image_url,
        },
      };
    });

    return NextResponse.json(tweets);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ error: 'Failed to fetch tweets' }, { status: 500 });
  }
}