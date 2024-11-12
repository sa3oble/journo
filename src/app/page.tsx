import { TweetFeed } from '@/components/TweetFeed';
import { Newspaper } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="bg-white border-b border-indigo-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Newspaper className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">MediaWatch</h1>
                <p className="text-sm text-gray-500">Live PR & Journalist Requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-2xl font-bold text-white mb-2">
              #journorequest #prrequest
            </h2>
            <p className="text-indigo-100">
              Real-time feed of media opportunities and press requests
            </p>
          </div>
          <div className="p-6">
            <TweetFeed />
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-gray-500">
        <p>Data refreshes automatically every 30 seconds</p>
      </footer>
    </div>
  );
}