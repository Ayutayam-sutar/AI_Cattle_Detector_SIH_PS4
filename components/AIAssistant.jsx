import React, { useState, useRef, useEffect } from 'react';
import { getAIAssistantResponse } from '../services/geminiService';
import Spinner from './Spinner';
import { useAuth } from '../context/AuthContext';

const AIAssistant = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hello! I am PashuMitra AI, your veterinary assistant. How can I help you with your cattle today? You can also upload an image for analysis.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null); 
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);
    
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage({
                    file: file,
                    dataUrl: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async () => {
        if ((!input.trim() && !image) || isLoading) return;

        const userMessage = { 
            sender: 'user', 
            text: input,
            image: image?.dataUrl
        };
        setMessages(prev => [...prev, userMessage]);
        
        const textToSend = input;
        const imageToSend = image;

        setInput('');
        setImage(null);
        setIsLoading(true);

        try {
            const aiResponse = await getAIAssistantResponse(textToSend, imageToSend);
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
                <p className="mt-2 text-md text-stone-600">Have a question? Ask our AI for instant advice, with or without an image.</p>
            </div>
            <div className="bg-white shadow-2xl rounded-2xl border border-stone-200 overflow-hidden">
                <div className="h-[60vh] p-6 overflow-y-auto space-y-6 bg-stone-50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full text-white flex items-center justify-center font-semibold text-sm ${msg.sender === 'ai' ? 'bg-emerald-500' : 'bg-stone-600'}`}>
                                {msg.sender === 'ai' ? 'AI' : user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className={`max-w-lg rounded-xl shadow-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-stone-800'}`}>
                                {msg.image && <img src={msg.image} alt="User upload" className="rounded-t-xl max-h-60 w-full object-cover" />}
                                {msg.text && <p className="p-4" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold text-sm">AI</div>
                            <div className="max-w-lg p-4 rounded-xl bg-white text-stone-800"><Spinner /></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {image && (
                    <div className="p-4 border-t border-stone-200 bg-white relative">
                        <p className="text-xs font-medium text-stone-600 mb-2">Image attached:</p>
                        <img src={image.dataUrl} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                        <button 
                            onClick={() => setImage(null)}
                            className="absolute top-2 left-20 bg-black/60 text-white rounded-full h-6 w-6 flex items-center justify-center text-lg font-bold leading-none hover:bg-black"
                            aria-label="Remove image"
                        >
                            &times;
                        </button>
                    </div>
                )}

                <div className="p-4 border-t border-stone-200 bg-white flex items-center gap-2 sm:gap-4">
                    <label htmlFor="chat-image-upload" className="flex-shrink-0 cursor-pointer p-2 rounded-full text-stone-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </label>
                    <input id="chat-image-upload" type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question or describe the image..."
                        className="flex-grow px-4 py-3 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || (!input.trim() && !image)}
                        className="flex-shrink-0 h-12 w-12 border border-transparent rounded-full shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
                        aria-label="Send message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l7 7-7 7" /></svg>
                    </button>
                </div> 
            </div>
        </div>
    );
};

export default AIAssistant;