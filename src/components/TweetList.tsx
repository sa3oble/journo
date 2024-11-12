'use client';

import { MessageSquare, Repeat2, Heart } from 'lucide-react';
import { Tweet } from '@/types';

interface TweetListProps {
  tweets: Tweet[];
}

export default function TweetList({ tweets }: TweetListProps) {
  if (tweets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">Waiting for new tweets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div
          key={tweet.id}
          className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">
                  {tweet.author?.name}
                </span>
                <span className="text-gray-500">
                  @{tweet.author?.username}
                </span>
              </div>
              <p className="mt-2 text-gray-800">{tweet.text}</p>
              <div className="mt-4 flex items-center space-x-6 text-gray-500">
                <button className="flex items-center space-x-2 hover:text-blue-500">
                  <MessageSquare className="w-4 h-4" />
                  <span>Reply</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-500">
                  <Repeat2 className="w-4 h-4" />
                  <span>Retweet</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-red-500">
                  <Heart className="w-4 h-4" />
                  <span>Like</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}