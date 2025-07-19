import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useAuth } from "@/hooks/useAuth"; // ✅ make sure this returns the logged-in user

type Sender = 'user' | 'bot';

interface UIMessage {
  text: string;
  sender: Sender;
}

interface HistoryMessage {
  role: 'user' | 'model';
  parts: string[];
}

const ChatbotPage: React.FC = () => {
  const { user } = useAuth(); // ✅ Auth context providing current user
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const isDark = false;

  const handleSend = useCallback(async () => {
    if (!query.trim() || !user?.id) return;

    const userMsg: UIMessage = { text: query, sender: 'user' };
    const newHistoryEntry: HistoryMessage = { role: 'user', parts: [query] };

    setMessages(prev => [...prev, userMsg]);
    setHistory(prev => [...prev, newHistoryEntry]);
    setQuery('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        message: query,
        history,
        user_id: user.id, // ✅ pass user ID
      });

      const replyText = response.data?.response?.trim() || '🤖 No response from Gemini.';
      const updatedHistory: HistoryMessage[] = response.data?.updated_history || [];

      setMessages(prev => [...prev, { text: replyText, sender: 'bot' }]);
      setHistory(updatedHistory);
    } catch (err) {
      console.error('❌ Error sending message:', err);
      setMessages(prev => [
        ...prev,
        {
          text: '⚠️ Failed to fetch response. Please check your server or Gemini API key.',
          sender: 'bot',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [query, history, user]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '850px', margin: 'auto' }}>
      <h2 className="text-2xl font-bold mb-4">💬 Gemini AI Chatbot</h2>

      <div className="bg-white rounded-lg border p-4 h-[500px] overflow-y-auto shadow">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && <FaRobot className="mt-1 mr-2 text-gray-500" />}
            <div
              className={`rounded-xl px-4 py-2 max-w-[75%] text-sm shadow-sm ${
                msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
            {msg.sender === 'user' && <FaUser className="mt-1 ml-2 text-blue-500" />}
          </div>
        ))}
        {loading && (
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <FaRobot className="mr-2" />
            <FaSpinner className="spin" /> <span className="ml-2">Gemini is typing...</span>
          </div>
        )}
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask your query here..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`ml-2 px-4 py-2 rounded-lg text-white text-base ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Send
        </button>
      </div>

      <style>
        {`
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ChatbotPage;
