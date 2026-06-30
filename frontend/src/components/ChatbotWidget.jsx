import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, RefreshCw, Sparkles, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const QUICK_PROMPTS = [
    { label: "Check Active Orders", text: "Show my active orders" },
    { label: "Order Not Received", text: "I didn't receive my order" },
    { label: "Return Policy", text: "What is your return policy?" },
    { label: "Shipping Fees", text: "How much is shipping?" }
];

const ChatbotWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm Flexy, your FlexDrip AI Assistant. How can I help you with your streetwear orders or portal policies today?" }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (textToSend) => {
        const query = textToSend || inputText;
        if (!query.trim()) return;

        // User message
        const updatedMessages = [...messages, { role: 'user', content: query }];
        setMessages(updatedMessages);
        setInputText('');
        setIsLoading(true);

        try {
            // Map the history for the backend agent
            const history = updatedMessages.slice(1, -1).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));

            const response = await axios.post(`${BACKEND_URL}/api/chatbot/message`, {
                message: query,
                history
            }, {
                withCredentials: true
            });

            if (response.data?.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again." }]);
            }
        } catch (error) {
            console.error("Chatbot Error:", error);
            const errorMsg = error.response?.data?.message || "Something went wrong. Please check your connection.";
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSendMessage();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
            {/* Expanded Chat Window */}
            {isOpen && (
                <div className="w-[360px] sm:w-[400px] h-[500px] bg-white/95 backdrop-blur-md rounded-3xl border border-neutral-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-200">
                    
                    {/* Header */}
                    <div className="bg-black text-white p-4.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 shadow-sm">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider">Flexy</h4>
                                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    FlexDrip Support Bot
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-neutral-800 rounded-xl transition-all cursor-pointer text-neutral-400 hover:text-white"
                        >
                            <X className="w-4.5 h-4.5" />
                        </button>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-100 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                        <ShieldAlert className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>Secure Agent Session</span>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#fafaf9]/30">
                        {messages.map((msg, idx) => {
                            const isUser = msg.role === 'user';
                            return (
                                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-2 max-w-[82%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                        
                                        {/* Avatar */}
                                        <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold border shadow-xs ${
                                            isUser 
                                                ? 'bg-neutral-900 border-neutral-800 text-white' 
                                                : 'bg-white border-neutral-200 text-black'
                                        }`}>
                                            {isUser ? (user?.fullName ? user.fullName[0].toUpperCase() : 'U') : 'F'}
                                        </div>

                                        {/* Content Bubble */}
                                        <div className={`px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                                            isUser 
                                                ? 'bg-neutral-900 text-white rounded-tr-none' 
                                                : 'bg-white text-neutral-850 border border-neutral-200/60 rounded-tl-none shadow-[0_2px_8px_rgba(0,0,0,0.01)]'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Loading State / Typing indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 max-w-[82%] items-center">
                                    <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold border border-neutral-200 bg-white text-black">
                                        F
                                    </div>
                                    <div className="px-4.5 py-3 rounded-2xl bg-white border border-neutral-200/60 rounded-tl-none shadow-xs flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts Container */}
                    {messages.length === 1 && (
                        <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50/50 flex flex-wrap gap-1.5">
                            {QUICK_PROMPTS.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(prompt.text)}
                                    className="px-2.5 py-1.5 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-black rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                                >
                                    {prompt.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Message Input Form */}
                    <form onSubmit={handleFormSubmit} className="p-3 border-t border-neutral-150 bg-white flex gap-2 items-center">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isLoading}
                            className="flex-grow bg-neutral-50 border border-neutral-200 focus:border-neutral-300 focus:bg-white rounded-xl py-2.5 px-4 text-xs font-semibold outline-none transition-all placeholder:text-neutral-400"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputText.trim()}
                            className="p-2.5 bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Chat Bubble Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-13 h-13 rounded-full bg-black hover:bg-neutral-900 text-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-105 cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
            >
                {isOpen ? (
                    <X className="w-5 h-5 transition-transform" />
                ) : (
                    <MessageSquare className="w-5 h-5 transition-transform" />
                )}
            </button>
        </div>
    );
};

export default ChatbotWidget;
