import React, { useState, useRef, useEffect } from 'react';
import { getAIAssistantResponse } from '../services/geminiService';
import Spinner from './Spinner';
import { useAuth } from '../context/AuthContext';

const AIAssistant = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hello! I am PashuMitra AI, your veterinary assistant. How can I help you with your cattle today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await getAIAssistantResponse(input);
            const aiMessage = { sender: 'ai', text: aiResponse };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { 
                sender: 'ai', 
                text: 'I am having trouble connecting. Please try again later.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-stone-900">AI Veterinary Assistant</h2>
                <p className="mt-2 text-md text-stone-600">Have a question? Ask our AI for instant advice.</p>
            </div>
            <div className="bg-white shadow-2xl rounded-2xl border border-stone-200 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 ">
                <div className="h-[60vh] p-6 overflow-y-auto space-y-6 bg-stone-50 bg-gradient-to-br from-emerald-50 via-white to-blue-50 ">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full text-white flex items-center justify-center font-semibold text-sm ${msg.sender === 'ai' ? 'bg-emerald-500' : 'bg-stone-600'}`}>
                                {msg.sender === 'ai' ? 'AI' : user?.name.charAt(0).toUpperCase() || 'U'}
                            </div>
                            {/* Message Bubble */}
                            <div className={`max-w-lg p-4 rounded-xl shadow-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-stone-800'}`}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold text-sm">
                                AI
                            </div>
                            <div className="max-w-lg p-4 rounded-xl bg-white text-stone-800">
                                <Spinner />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-stone-200 bg-white flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about feeding, health, or general care..."
                        className="flex-grow px-4 py-3 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="flex-shrink-0 h-12 w-12 border border-transparent rounded-full shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
                        aria-label="Send message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" transform="rotate(180 12 12) translate(-2 -0)" /></svg>

                    </button>
                   
                </div> 
                <p className="text-center text-black-300 text-sm p-2">AI can make mistakes. Check important info.</p>
            </div>
        </div>
    );
};

export default AIAssistant;