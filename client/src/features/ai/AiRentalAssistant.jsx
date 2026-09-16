import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { aiApi } from '../../services/aiApi';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  Fuel, 
  Zap, 
  Clock, 
  ShieldCheck, 
  RotateCcw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const AiRentalAssistant = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Hi! I'm your **RentRide AI Assistant**. How can I help you today? I can help you discover rides, check rental plans, find nearby hubs, or explain our cancellation policies.",
      vehicles: [],
      suggestedActions: [
        'Find bikes under ₹800',
        'Explain rental plans',
        'Electric vehicles',
        'What is cancellation policy?'
      ]
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (userText) => {
    const textToSend = userText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const newMsg = {
      id: userMsgId,
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await aiApi.sendAssistantMessage({
        message: textToSend,
        userContext: { city: 'Indore' }
      });

      const aiResponse = res.data?.data || res.data;
      const aiReplyMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse.reply || "Here's what I found for you:",
        vehicles: aiResponse.vehicles || [],
        suggestedActions: aiResponse.suggestedActions || ['Find Bikes', 'Show Cars', 'Explain Plans']
      };

      setMessages((prev) => [...prev, aiReplyMsg]);
    } catch (err) {
      console.error('AI assistant communication error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I couldn't reach the AI server right now, but you can browse our full fleet anytime!",
          suggestedActions: ['Explore All Vehicles', 'Search Indore Hubs']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionText) => {
    if (actionText === 'Explore All Vehicles') {
      navigate('/explore');
      setIsOpen(false);
      return;
    }
    handleSendMessage(actionText);
  };

  return (
    <>
      {/* Floating Action Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 text-white font-bold text-xs shadow-2xl hover:shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
            </div>
            <span className="tracking-wide">AI Assistant</span>
            <span className="hidden sm:inline text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
              Ask Me
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 text-white shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm leading-tight flex items-center gap-1.5">
                  RentRide AI Assistant
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[11px] text-white/80">
                  Instant fleet guidance & policy navigator
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-slate-900/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-700 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Structured Vehicle Recommendation Cards (Feature D Safety Rule: Non-transactional, safe checkout CTA) */}
                {msg.vehicles && msg.vehicles.length > 0 && (
                  <div className="w-full space-y-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                      Matching Verified Fleet:
                    </span>
                    <div className="space-y-2">
                      {msg.vehicles.map((v) => (
                        <div
                          key={v._id}
                          className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-xs hover:border-brand-300 transition-all"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100 dark:border-slate-700">
                              <img
                                src={v.images?.[0]?.url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80'}
                                alt={v.model}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="truncate">
                              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {v.brand} {v.model}
                              </h4>
                              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                <span>₹{v.pricing?.hourlyRate}/hr</span>
                                <span>•</span>
                                <span>{v.location?.city || 'Indore'}</span>
                              </p>
                              {v.fuelEconomy && (
                                <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                  {v.fuelEconomy} {v.fuelEconomyUnit || 'km/l'}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            <Link
                              to={`/checkout/${v._id}`}
                              onClick={() => setIsOpen(false)}
                              className="px-2.5 py-1 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-[10px] font-bold text-center transition-all shadow-xs"
                            >
                              Proceed to Checkout
                            </Link>
                            <Link
                              to={`/vehicles/${v._id}`}
                              onClick={() => setIsOpen(false)}
                              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-semibold text-center transition-all"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Quick Action Pills */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickAction(action)}
                        className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-all"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[11px] ml-1">Analyzing verified fleet...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about rides, plans, policies..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white transition-all disabled:opacity-50 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
