"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Paperclip, ChevronDown, FileText, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    citations?: { title: string; page: number }[];
    timestamp: Date;
}

const MOCK_MESSAGES: Message[] = [
    {
        id: '1',
        role: 'assistant',
        content: 'Hola Juan, soy tu **Asesor Contractual**. Tengo acceso a todas las bases y contratos del proyecto "Minera Escondida Ph2". ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
    }
];

interface ChatWidgetProps {
    projectId?: number;
    embedded?: boolean;
}

export function ChatWidget({ projectId, embedded = false }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(embedded); // Always open if embedded
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [mode, setMode] = useState<'EXPERT' | 'GENERAL'>('EXPERT');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Mock Messages based on Project Context
    useEffect(() => {
        if (projectId === 4) { // Trolley
            setMessages([{
                id: '1',
                role: 'assistant',
                content: 'Hola Juan, soy tu **Asesor de Cierre**. Tengo acceso a todos los finiquitos y actas de recepción de "TROLLEY". ¿Necesitas redactar el acta final?',
                timestamp: new Date(),
            }]);
        } else if (projectId === 5) { // Subestación
            setMessages([{
                id: '1',
                role: 'assistant',
                content: 'Hola Juan, soy tu **Asesor Contractual**. Tengo acceso a las Bases Técnicas y Planos de "Subestación O\'Higgins". ¿Consultamos alguna EETT?',
                timestamp: new Date(),
            }]);
        } else {
            setMessages(MOCK_MESSAGES);
        }
    }, [projectId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: mode === 'EXPERT'
                    ? `Basado en el contrato del proyecto ${projectId ? '(ID: ' + projectId + ')' : ''}, el plazo es de 15 días.`
                    : 'Aquí tienes un resumen general...',
                citations: mode === 'EXPERT' ? [{ title: 'Contrato Principal.pdf', page: 45 }] : undefined,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Simple Markdown Parser (Bold only for MVP)
    const renderContent = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Expanded Window */}
            {isOpen && (
                <div className="mb-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 animate-in slide-in-from-bottom-10 fade-in duration-200">

                    {/* Header */}
                    <div className={`p-4 rounded-t-2xl flex items-center justify-between ${mode === 'EXPERT' ? 'bg-slate-900' : 'bg-indigo-600'} text-white transition-colors duration-300`}>
                        <div className="flex items-center space-x-3">
                            <div className="p-1.5 bg-white/20 rounded-full">
                                {mode === 'EXPERT' ? <Bot size={20} /> : <Sparkles size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Asesor {mode === 'EXPERT' ? 'Contractual' : 'General'}</h3>
                                <div className="flex items-center text-xs text-white/70 cursor-pointer hover:text-white" onClick={() => setMode(mode === 'EXPERT' ? 'GENERAL' : 'EXPERT')}>
                                    <span>{mode === 'EXPERT' ? 'Contexto: PMI & Contratos' : 'Contexto: IA General'}</span>
                                    <ChevronDown size={12} className="ml-1" />
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-slate-800 border border-gray-200 rounded-bl-none'
                                    }`}>
                                    <p className="leading-relaxed whitespace-pre-wrap">{renderContent(msg.content)}</p>

                                    {/* Citations */}
                                    {msg.role === 'assistant' && msg.citations && (
                                        <div className="mt-3 space-y-1">
                                            <div className="h-px bg-gray-100 w-full mb-2"></div>
                                            {msg.citations.map((cit, idx) => (
                                                <button key={idx} className="flex items-center space-x-2 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors w-full text-left">
                                                    <FileText size={12} />
                                                    <span className="truncate flex-1">{cit.title}</span>
                                                    <span className="font-mono text-xs opacity-70 whitespace-nowrap">Pg {cit.page}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-200 rounded-b-2xl">
                        <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2 ring-1 ring-transparent focus-within:ring-blue-500 transition-shadow">
                            <button className="text-gray-400 hover:text-gray-600 mr-2" title="Subir documento">
                                <Paperclip size={18} />
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Escribe tu consulta..."
                                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-gray-500"
                                autoFocus
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className={`ml-2 p-1.5 rounded-full ${inputValue.trim() ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'bg-gray-200 text-gray-400'} transition-all`}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-gray-400">La IA puede cometer errores. Verifica la info contractual.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-gray-200 text-gray-600 rotate-90' : 'bg-slate-900 text-white'
                    }`}
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}

                {/* Notification Badge if closed */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 border-2 border-white rounded-full"></span>
                )}
            </button>
        </div>
    );
}
