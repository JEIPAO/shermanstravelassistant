import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [question, setQuestion] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { role: 'user', content: question };
    setChats((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/chat', { question });
      const aiMsg = { role: 'assistant', content: res.data.answer, sources: res.data.sources };
      setChats((prev) => [...prev, aiMsg]);
    } catch (err) {
      alert('Error fetching response'+ err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [chats]);

  return (
    <div className="min-h-screen bg-gray-200 from-blue-50 to-white py-4 px-2 sm:py-8 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-4 sm:mb-6">
        ShermansTravel Knowledge Assistant
      </h1>

      <div className="max-w-full sm:max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-2 sm:p-6 flex flex-col overflow-hidden">
        <div ref={chatRef} className="flex-1 overflow-y-auto mb-2 sm:mb-4 max-h-[60vh]">
          {chats.map((chat, idx) => (
            <div key={idx} className={`p-2 sm:p-4 ${chat.role === 'user' ? 'chat chat-start' : 'chat chat-end'}`}>
              <div className="chat-header text-base sm:text-lg font-semibold">
                {chat.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className={`chat-bubble break-words ${chat.role === 'user' ? '' : 'bg-blue-200 '}`}>
                {chat.content}
                {chat.sources && (
                  <div className="chat-footer text-base">
                    Sources:{' '}
                    {chat.sources.map((s, i) => (
                      <a key={i} href={s} target="_blank" rel="noopener noreferrer" className="underline text-blue-500">[{i + 1}]</a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center space-x-2 my-2 sm:my-4 ">
            <span className="text-blue-400 loading loading-dots loading-xl "></span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 border-t pt-2 sm:pt-4">
          <input
            type="text"
            disabled={loading}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about Alaska, Hawaii, etc..."
          />

              <button 
               type="submit"
              disabled={loading}
              className="bg-blue-500 text-white font-bold rounded-md hover:border-blue-600 hover:bg-blue-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
         
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentcolor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
          {/* <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
          >
            Send
          </button> */}
        </form>
      </div>
    </div>
  )
}

export default App
