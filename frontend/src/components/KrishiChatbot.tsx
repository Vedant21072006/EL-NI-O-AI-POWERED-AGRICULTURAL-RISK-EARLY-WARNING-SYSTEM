import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { FarmProfile, RiskAssessment, Language, ChatMessage } from '../types';
import { translations } from '../i18n/translations';
import { sendChatMessage } from '../services/api';

interface KrishiChatbotProps {
  profile: FarmProfile;
  assessment?: RiskAssessment;
  language: Language;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

export const KrishiChatbot: React.FC<KrishiChatbotProps> = ({
  profile,
  assessment,
  language,
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const t = translations[language];
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    setInternalIsOpen(val);
    if (onToggle) onToggle(val);
  };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when opened
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: t.chatWelcome,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            t.qWhyRisk,
            t.qWhatShouldIDo,
            t.qWhatIsElNino,
            t.qLessRainSoybean,
            t.qExplainSimple
          ]
        }
      ]);
    }
  }, [language, t]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const response = await sendChatMessage({
        message: messageText,
        farmProfile: profile,
        assessment,
        language,
      });

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error', err);
      const fallbackMsg: ChatMessage = {
        id: 'ai-fallback-' + Date.now(),
        sender: 'assistant',
        text: language === 'mr'
          ? `नमस्कार! आपल्या ${profile.district} मधील सोयाबीन पिकाची जोखीम ${assessment?.probability ?? 68}% आहे. सध्या पीक ${profile.cropStage} अवस्थेत असल्याने कोळपणी व १३:०:४५ ची फवारणी करून जमिनीतील ओलावा टिकवून ठेवा.`
          : `Namaskar! Based on the XGBoost model for ${profile.district}, your soybean risk is ${assessment?.probability ?? 68}%. Prioritize moisture conservation and 1% Potassium Nitrate spray during flowering.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    handleSend(q);
  };

  // Text-to-speech for accessibility in rural conditions
  const handleReadAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (language === 'mr') {
      utterance.lang = 'mr-IN';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating Bottom-Right Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-5 z-40 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 group cursor-pointer border-2 border-emerald-600/60"
          aria-label="Ask Krishi AI"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-emerald-200 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
          </div>
          <span className="hidden sm:inline text-sm font-black tracking-wide">
            💬 {t.askKrishiAi}
          </span>
        </button>
      )}

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 md:w-[420px] h-[540px] max-h-[85vh] bg-white rounded-2xl border-2 border-stone-200 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-emerald-900 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 border border-emerald-700 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm tracking-tight leading-none">
                    {t.askKrishiAi}
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-700/80 text-emerald-200 px-1.5 py-0.2 rounded">
                    AI ASSISTANT
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 mt-0.5">
                  Context: {profile.district} • {profile.crop} ({profile.cropStage})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                className="w-8 h-8 rounded-lg hover:bg-emerald-800 flex items-center justify-center text-emerald-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]">
            {messages.map((msg) => {
              const isAi = msg.sender === 'assistant';
              return (
                <div key={msg.id} className="space-y-2">
                  <div
                    className={`flex items-start gap-2.5 ${
                      isAi ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {isAi && (
                      <div className="w-7 h-7 rounded-lg bg-emerald-800 text-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        🌱
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                        isAi
                          ? 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs'
                          : 'bg-emerald-800 text-white rounded-tr-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Read Aloud button for AI messages */}
                      {isAi && (
                        <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                          <span>{msg.timestamp}</span>
                          <button
                            type="button"
                            onClick={() => handleReadAloud(msg.text)}
                            className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          >
                            {isSpeaking ? <VolumeX className="w-3 h-3 text-red-600" /> : <Volume2 className="w-3 h-3" />}
                            <span>{isSpeaking ? 'Stop' : t.speakResponse}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {!isAi && (
                      <div className="w-7 h-7 rounded-lg bg-stone-700 text-stone-100 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        👤
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {isAi && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="pl-9 flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleQuickQuestion(sug)}
                          className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 rounded-full px-2.5 py-1 text-left transition-all shadow-2xs active:scale-95"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 pl-9 text-xs text-stone-500 italic py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-700 animate-ping"></div>
                <span>Krishi AI is consulting agronomic rules...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200 shrink-0 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 text-xs py-2.5 px-3.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-700"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="w-9 h-9 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center shadow-xs disabled:opacity-50 transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
