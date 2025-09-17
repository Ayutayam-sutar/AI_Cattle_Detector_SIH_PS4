// AIVetAssistant.jsx (Definitive Final Version)
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AIVetAssistant.css';

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

const AIVetAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I am PashuMitra AI. How can I assist you?', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const [style, setStyle] = useState({ width: 370, height: 550, bottom: 25, right: 25 });
    const actionStartRef = useRef(null);

    const addMessage = (message) => {
        setMessages(prev => [...prev, { ...message, timestamp: new Date() }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() && !imageFile) return;
        const userMessageText = input || (imageFile ? "Please analyze this image." : "");

        let imageUrl = null;
        if (imageFile) { imageUrl = URL.createObjectURL(imageFile); }

        addMessage({ sender: 'user', text: input, imageUrl: imageUrl });

        setInput('');
        const submittedImageFile = imageFile;
        setImageFile(null);
        setIsLoading(true);

        try {
            let imageBase64 = null;
            if (submittedImageFile) { imageBase64 = await toBase64(submittedImageFile); }
            const response = await fetch('http://localhost:3001/api/chatbot/vet-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessageText, imageBase64: imageBase64 })
            });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || "Failed to get response from server."); }
            const data = await response.json();
            addMessage({ sender: 'bot', text: data.reply });
        } catch (error) {
            console.error("Chat error:", error);
            addMessage({ sender: 'bot', text: "Sorry, an error occurred. Please check the backend connection and try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleMouseDown = useCallback((e, action, direction = '') => {
        if (e.button !== 0) return;
        e.stopPropagation();
        const rect = chatContainerRef.current.getBoundingClientRect();
        actionStartRef.current = { action, direction, startX: e.clientX, startY: e.clientY, startWidth: rect.width, startHeight: rect.height, startRight: window.innerWidth - rect.right, startBottom: window.innerHeight - rect.bottom };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!actionStartRef.current) return;
        const { action, direction, startX, startY, startWidth, startHeight, startRight, startBottom } = actionStartRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const minWidth = 300;
        const minHeight = 400;
        if (action === 'drag') {
            setStyle(prev => ({ ...prev, right: startRight - dx, bottom: startBottom - dy }));
        } else if (action === 'resize') {
            let newWidth = startWidth, newHeight = startHeight;
            if (direction.includes('right')) newWidth = Math.max(minWidth, startWidth + dx);
            if (direction.includes('left')) newWidth = Math.max(minWidth, startWidth - dx);
            if (direction.includes('bottom')) newHeight = Math.max(minHeight, startHeight + dy);
            if (direction.includes('top')) newHeight = Math.max(minHeight, startHeight - dy);
            setStyle(prev => ({ ...prev, width: newWidth, height: newHeight }));
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        actionStartRef.current = null;
    }, [handleMouseMove]);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
    useEffect(scrollToBottom, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <>
            <button className="chat-popup-button" onClick={toggleChat}>
                {/* --- NEW, MORE STYLISH "AI" LOGO --- */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.3333 10H16.6667V7.5H18.3333V10ZM15 17.5H20V15.8333H15V17.5ZM15 13.3333H20V11.6667H15V13.3333ZM4 17.5H13.3333V15.8333H4V17.5ZM4 13.3333H13.3333V11.6667H4V13.3333ZM4 9.16667H13.3333V7.5H4V9.16667ZM10.5 6.16667C10.5 5.24167 9.75833 4.5 8.83333 4.5C7.90833 4.5 7.16667 5.24167 7.16667 6.16667C7.16667 7.09167 7.90833 7.83333 8.83333 7.83333C9.75833 7.83333 10.5 7.09167 10.5 6.16667ZM12 20.8333L8.33333 17.5H5C4.54167 17.5 4.16667 17.125 4.16667 16.6667V5.83333C4.16667 5.375 4.54167 5 5 5H19.1667C19.625 5 20 5.375 20 5.83333V10.8333C20 11.2917 19.625 11.6667 19.1667 11.6667H14.1667C13.7083 11.6667 13.3333 12.0417 13.3333 12.5V17.5C13.3333 17.9583 13.7083 18.3333 14.1667 18.3333H18.3333L22 21.6667V5C22 3.825 21.0083 2.83333 19.8333 2.83333H4.16667C3 2.83333 2 3.825 2 5V21.6667L6.66667 17.5H12V20.8333Z" />
                </svg>
            </button>

            {isOpen && (
                <div className="chat-container" ref={chatContainerRef} style={{ width: `${style.width}px`, height: `${style.height}px`, bottom: `${style.bottom}px`, right: `${style.right}px` }}>
                    <div className="resize-handle handle-top" onMouseDown={(e) => handleMouseDown(e, 'resize', 'top')}></div>
                    <div className="resize-handle handle-right" onMouseDown={(e) => handleMouseDown(e, 'resize', 'right')}></div>
                    <div className="resize-handle handle-bottom" onMouseDown={(e) => handleMouseDown(e, 'resize', 'bottom')}></div>
                    <div className="resize-handle handle-left" onMouseDown={(e) => handleMouseDown(e, 'resize', 'left')}></div>
                    <div className="resize-handle handle-top-left" onMouseDown={(e) => handleMouseDown(e, 'resize', 'top-left')}></div>
                    <div className="resize-handle handle-top-right" onMouseDown={(e) => handleMouseDown(e, 'resize', 'top-right')}></div>
                    <div className="resize-handle handle-bottom-left" onMouseDown={(e) => handleMouseDown(e, 'resize', 'bottom-left')}></div>
                    <div className="resize-handle handle-bottom-right" onMouseDown={(e) => handleMouseDown(e, 'resize', 'bottom-right')}></div>

                    <div className="chat-header" onMouseDown={(e) => handleMouseDown(e, 'drag')} style={{ cursor: 'move' }}>
                        <span>PashuMitra AI</span>
                        {/* --- NEW CLOSE BUTTON --- */}
                        <button className="chat-close-btn" onClick={toggleChat} title="Close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.sender}-wrapper`}>
                                <div className={`message ${msg.sender}-message`}>
                                    {msg.imageUrl && <img src={msg.imageUrl} alt="User upload" className="user-upload-image" />}
                                    {msg.text && <div>{msg.text}</div>}
                                </div>
                                <div className="message-timestamp">{formatTime(msg.timestamp)}</div>
                            </div>
                        ))}
                        {isLoading && <div className="message bot-message">● ● ●</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input-form" onSubmit={handleSubmit}>
                        <div className="input-wrapper">
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={imageFile ? imageFile.name : "Ask a question..."} disabled={isLoading} />
                            <input type="file" id="file-upload" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                            <label htmlFor="file-upload" title="Upload Image">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            </label>
                        </div>
                        <button type="submit" disabled={isLoading} title="Send Message" className="send-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"></path></svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default AIVetAssistant;