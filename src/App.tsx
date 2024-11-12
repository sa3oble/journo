import React, { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import { Search, RefreshCw, Archive } from 'lucide-react';
import TweetList from './components/TweetList';
import SearchBox from './components/SearchBox';
import { Tweet } from './types';

const socket = io('http://localhost:3000');

function App() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('tweet', (tweet: Tweet) => {
      setTweets(prev => [tweet, ...prev].slice(0, 20));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('tweet');
    };
  }, []);

  useEffect(() => {
    const filtered = tweets.filter(tweet => {
      const lowerText = tweet.text.toLowerCase();
      const term1Match = !searchTerm1 || lowerText.includes(searchTerm1.toLowerCase());
      const term2Match = !searchTerm2 || lowerText.includes(searchTerm2.toLowerCase());
      return term1Match && term2Match;
    });
    setFilteredTweets(filtered);
  }, [tweets, searchTerm1, searchTerm2]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            Live Twitter Feed
          </h1>
          <div className="flex items-center justify-center gap-2 text-indigo-600">
            <RefreshCw className={`w-5 h-5 ${isConnected ? 'animate-spin' : ''}`} />
            <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <SearchBox
            value={searchTerm1}
            onChange={setSearchTerm1}
            placeholder="Filter by keyword..."
            label="Search Filter 1"
          />
          <SearchBox
            value={searchTerm2}
            onChange={setSearchTerm2}
            placeholder="Filter by keyword..."
            label="Search Filter 2"
          />
        </div>

        <TweetList tweets={filteredTweets} />
      </div>
    </div>
  );
}

export default App;