import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth } from "@/hooks/useAuth";

// Modern avatars (can be replaced with images)
const BOT_AVATAR = "🤖";
const USER_AVATAR = "👤";

type Sender = 'user' | 'bot';

interface UIMessage {
  text: string;
  sender: Sender;
  timestamp?: number;
  responseTime?: number;
}

interface HistoryMessage {
  role: 'user' | 'model';
  parts: string[];
}

// ✅ Create axios instance with optimized settings
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 20000, // 20 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ✅ Memoize history to prevent unnecessary re-renders
  const memoizedHistory = useMemo(() => history, [history]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // ✅ Optimistic update function
  const addOptimisticMessage = useCallback((text: string, sender: Sender) => {
    const newMessage: UIMessage = {
      text,
      sender,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleSend = useCallback(async () => {
    if (!query.trim() || !user?.id || loading) return;

    const currentQuery = query.trim();
    const startTime = Date.now();

    // ✅ Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // ✅ Create new abort controller
    abortControllerRef.current = new AbortController();

    // ✅ Optimistic update - show user message immediately
    addOptimisticMessage(currentQuery, 'user');
    
    const newHistoryEntry: HistoryMessage = { role: 'user', parts: [currentQuery] };
    setHistory(prev => [...prev, newHistoryEntry]);
    setQuery('');
    setLoading(true);
    setResponseTime(null);

    try {
      const response = await api.post('/chat', {
        message: currentQuery,
        history: memoizedHistory,
        user_id: user.id,
      }, {
        signal: abortControllerRef.current.signal,
      });

      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      
      const replyText = response.data?.response?.trim() || '🤖 No response from Gemini.';
      const updatedHistory: HistoryMessage[] = response.data?.updated_history || [];

      // ✅ Add bot response with response time
      const botMessage: UIMessage = {
        text: replyText,
        sender: 'bot',
        timestamp: Date.now(),
        responseTime: responseTimeMs,
      };

      setMessages(prev => [...prev, botMessage]);
      setHistory(updatedHistory);
      setResponseTime(responseTimeMs);

      console.log(`⚡ Response time: ${responseTimeMs}ms`);

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Request was cancelled');
        return;
      }

      console.error('❌ Error sending message:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Unknown error occurred';
      
      const errorMsg: UIMessage = {
        text: `⚠️ Error: ${errorMessage}. Please check your server connection or try again later.`,
        sender: 'bot',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [query, memoizedHistory, user, loading, addOptimisticMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300">
      <div className="w-full max-w-2xl flex flex-col flex-1 rounded-3xl shadow-2xl bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 mt-8 mb-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-600/80 to-indigo-500/80 text-white flex items-center gap-2 sticky top-0 z-10">
          <span className="text-2xl">🤖</span>
          <h2 className="text-xl font-bold tracking-tight">Gemini AI Chatbot</h2>
          <span className="ml-auto text-xs opacity-80">Modern UI</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-transparent" style={{ minHeight: 400, maxHeight: 500 }}>
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-lg">Start a conversation with Gemini AI!</p>
              <p className="text-sm mt-2">Try asking: "What products do you recommend?"</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={msg.timestamp || index} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`rounded-full bg-gradient-to-br ${msg.sender === 'user' ? 'from-blue-400 to-blue-600' : 'from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-900'} w-10 h-10 flex items-center justify-center text-xl shadow-md`}>
                  {msg.sender === 'user' ? USER_AVATAR : BOT_AVATAR}
                </div>
                {/* Bubble */}
                <div className={`rounded-2xl px-4 py-3 shadow-md text-base whitespace-pre-line break-words ${msg.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'} relative`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                  {msg.responseTime && (
                    <div className="text-xs text-gray-400 mt-1 text-right">⚡ {msg.responseTime}ms</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse mt-2">
              <div className="rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-900 w-10 h-10 flex items-center justify-center text-xl shadow-md">{BOT_AVATAR}</div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-md">
                <span className="inline-block animate-bounce">Gemini is typing</span>
                <span className="inline-block animate-bounce delay-75">.</span>
                <span className="inline-block animate-bounce delay-150">.</span>
                <span className="inline-block animate-bounce delay-300">.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Sticky input bar */}
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 px-4 py-3 flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 backdrop-blur z-10"
        >
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={`rounded-full px-5 py-2 text-white font-semibold transition-colors shadow-md ${
              loading || !query.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;
