'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Repeat2, Heart, AlertCircle } from 'lucide-react';
import { SearchFilters } from './SearchFilters';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
  };
  author: {
    name: string;
    username: string;
    profile_image_url: string;
  };
}

export function TweetFeed() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch('/api/tweets');
        if (!response.ok) throw new Error('Failed to fetch tweets');
        const data = await response.json();
        setTweets(data);
        setFilteredTweets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tweets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTweets();
    const interval = setInterval(fetchTweets, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      setFilteredTweets(tweets);
    } else {
      const filtered = tweets.filter(tweet =>
        tweet.text.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredTweets(filtered);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 animate-pulse">Loading tweets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Tweets</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SearchFilters onSearch={handleSearch} />
      
      {filteredTweets.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center">
          <div className="max-w-sm mx-auto">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matching Tweets</h3>
            <p className="text-gray-600">Try adjusting your search filter to find more tweets</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTweets.map((tweet) => (
            <article 
              key={tweet.id} 
              className="group bg-white rounded-xl border border-gray-100 p-6 
                         hover:shadow-lg hover:border-indigo-100 transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={tweet.author.profile_image_url}
                  alt={tweet.author.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-100 group-hover:border-indigo-200 transition-colors"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      {tweet.author.name}
                    </h3>
                    <span className="text-gray-500">@{tweet.author.username}</span>
                    <span className="text-gray-300">·</span>
                    <time className="text-gray-500">
                      {new Date(tweet.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                  <p className="mt-2 text-gray-800 whitespace-pre-wrap">{tweet.text}</p>
                  <div className="flex items-center space-x-6 mt-4">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>{tweet.public_metrics.reply_count}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                      <Repeat2 className="w-5 h-5" />
                      <span>{tweet.public_metrics.retweet_count}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span>{tweet.public_metrics.like_count}</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}