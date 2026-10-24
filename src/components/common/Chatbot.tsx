import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Minimize2,
  ChevronUp,
  Copy,
  Check,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: 'assistant',
  content: 'Assalam-o-Alaikum & Welcome! 👋 I am the **BDS AI Assistant** for Blood Donor Society UET Narowal.\n\nHow can I help you today? You can ask me about **blood donation eligibility**, **blood group compatibility**, **emergency donor requests in Narowal**, or **upcoming campus drives**.',
  timestamp: 'Just now',
};

const SUGGESTIONS = [
  'Can I donate blood?',
  'What is blood group compatibility?',
  'How to request emergency blood?',
  'Upcoming blood camp at UET',
  'Thalassemia patient support',
];

export const Chatbot: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const replyText = data?.reply || 'I am currently unable to reach the server. Please try again.';

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        content: 'Thank you for your message. For immediate donor requests or inquiries in Narowal, please contact our 24/7 hotline at +92 300 1234567 or submit an Emergency Request from the menu.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Copied message to clipboard', 'info');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  // Simple formatter for basic markdown elements (bold, bullets, linebreaks)
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      // Bullets
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('• ');
      const cleanLine = isBullet ? line.trim().replace(/^[-*•]\s+/, '') : line;

      // Parse bold segments **bold**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIdx} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <span className="text-slate-700">{renderedParts}</span>
          </div>
        );
      }

      if (!cleanLine.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      return (
        <p key={lineIdx} className="text-slate-700 leading-relaxed my-0.5">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3">
          {/* Tooltip badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-lg border border-red-100 animate-in fade-in slide-in-from-right-3 duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Need Blood Help? Ask BDS AI</span>
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-red-700 via-rose-600 to-red-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-500/30"
            aria-label="Open BDS Chatbot"
            title="Chat with BDS AI Assistant"
            id="bds-chatbot-launcher"
          >
            <span className="absolute -inset-1 rounded-full bg-red-500/30 animate-ping pointer-events-none" />
            <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden ${
            isMinimized
              ? 'bottom-5 right-5 w-80 h-16'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[410px] h-[580px] max-h-[88vh]'
          }`}
          id="bds-chatbot-window"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Heart className="w-4 h-4 text-white fill-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-red-800 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight">BDS AI Assistant</h3>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-white/20 rounded-md tracking-wider">
                    24/7
                  </span>
                </div>
                <p className="text-[11px] text-red-100 flex items-center gap-1">
                  <span>Blood Donor Society UET Narowal</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {!isMinimized && (
                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Emergency Banner */}
              <div className="bg-red-50 border-b border-red-100 px-3.5 py-2 flex items-center justify-between text-xs text-red-900">
                <div className="flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate">Need immediate O- / rare units in Narowal?</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('emergency-request');
                  }}
                  className="font-bold underline text-red-700 hover:text-red-900 shrink-0 text-[11px] ml-2 cursor-pointer"
                >
                  Request Fast
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-xs sm:text-sm">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                          isUser
                            ? 'bg-slate-800 text-white'
                            : 'bg-red-600 text-white shadow-xs'
                        }`}
                      >
                        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>

                      <div className={`relative group max-w-[82%] sm:max-w-[78%]`}>
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed text-xs sm:text-sm ${
                            isUser
                              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-xs'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            renderFormattedText(msg.content)
                          )}
                        </div>

                        {/* Message Meta & Copy */}
                        <div
                          className={`flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 ${
                            isUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {!isUser && (
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="opacity-0 group-hover:opacity-100 hover:text-slate-600 transition-opacity p-0.5 cursor-pointer"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Pills */}
              <div className="px-3.5 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item)}
                    className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-slate-200/80 rounded-full shrink-0 transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about blood donation, eligibility, camps..."
                    disabled={isLoading}
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all text-slate-800 placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center shadow-sm hover:shadow-md hover:from-red-700 hover:to-rose-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
                  <span>Emergency: Rescue 1122</span>
                  <a
                    href="tel:+923001234567"
                    className="hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <PhoneCall className="w-2.5 h-2.5" />
                    <span>BDS Helpline</span>
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
