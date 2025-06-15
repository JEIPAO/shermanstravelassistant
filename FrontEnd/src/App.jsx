import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
 const [question, setQuestion] = useState('');
  const [chats, setChats] = useState([]);
  const chatRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { role: 'user', content: question };
    setChats((prev) => [...prev, userMsg]);
    setQuestion('');

    try {
      const res = await axios.post('http://localhost:3000/chat', { question });
      const aiMsg = { role: 'assistant', content: res.data.answer, sources: res.data.sources };
      setChats((prev) => [...prev, aiMsg]);
    } catch (err) {
      alert('Error fetching response'+ err.message);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [chats]);

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">ShermansTravel Knowledge Assistant</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[60vh] pr-2">
          {chats.map((chat, idx) => (
            <div key={idx} className={`p-4 rounded-lg shadow ${chat.role === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-green-100 self-start text-left'}`}>
              <p className="font-semibold mb-1">{chat.role === 'user' ? 'You' : 'Assistant'}</p>
              <p>{chat.content}</p>
              {chat.sources && (
                <div className="text-xs mt-2 text-gray-500">
                  Sources:{' '}
                  {chat.sources.map((s, i) => (
                    <a key={i} href={s} target="_blank" rel="noopener noreferrer" className="underline text-blue-500">[{i + 1}]</a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 border-t pt-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about Alaska, Hawaii, etc..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
