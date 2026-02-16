"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Subtitle, Description } from "../reusables/texts";
import { useLocation } from "@/contexts/location-context";
import { chatWithContext } from "@/app/actions/chat";
import { 
    SendHorizonal, 
    MapPin, 
    Loader2, 
    Globe2, 
    Compass, 
    UtensilsCrossed, 
    Landmark,
    User 
} from "lucide-react";
import Markdown from "react-markdown";

interface RightPanelProps {
    className?: string;
}

const suggestions = [
    { label: "Travel tours", icon: Compass, prompt: (name: string) => `What are the best travel tours and must-visit itineraries in ${name}?` },
    { label: "Local foods", icon: UtensilsCrossed, prompt: (name: string) => `What are the must-try local foods and dishes in ${name}?` },
    { label: "Culture", icon: Landmark, prompt: (name: string) => `Tell me about the culture, traditions, and cultural experiences to explore in ${name}.` },
];

const RightPanel: React.FC<RightPanelProps> = ({ className }) => {
    const {
        locationName,
        isLoading,
        messages,
        addMessage,
    } = useLocation();

    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Auto-generate overview when location changes
    useEffect(() => {
        if (locationName && messages.length === 0) {
           generateOverview();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationName]);

    const generateOverview = async () => {
        if (!locationName) return;

        setIsSending(true);
        const overviewPrompt = `Give me a brief, engaging overview of ${locationName}. Highlight what makes this place interesting — its history, culture, landmarks, and anything unique.`;

        addMessage({
            id: crypto.randomUUID(),
            role: "user",
            content: overviewPrompt,
        });

        try {
            const response = await chatWithContext(
                overviewPrompt,
                locationName,
                [],
            );

            if (response) {
                addMessage({
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: response,
                });
            }
        } catch {
            addMessage({
                id: crypto.randomUUID(),
                role: "assistant",
                content:
                    "Sorry, I couldn't generate an overview. Please try again.",
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !locationName || isSending) return;

        const userMessage = input.trim();
        setInput("");

        const userMsg = {
            id: crypto.randomUUID(),
            role: "user" as const,
            content: userMessage,
        };
        addMessage(userMsg);

        setIsSending(true);

        try {
            const history = messages.map((m) => ({
                role: m.role,
                content: m.content,
            }));

            const response = await chatWithContext(
                userMessage,
                locationName,
                history,
            );

            if (response) {
                addMessage({
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: response,
                });
            }
        } catch {
            addMessage({
                id: crypto.randomUUID(),
                role: "assistant",
                content:
                    "Sorry, I encountered an error. Please try again.",
            });
        } finally {
            setIsSending(false);
            inputRef.current?.focus();
        }
    };

    const handleSuggestionClick = (prompt: string) => {
        if (isSending || !locationName) return;
        setInput("");

        const userMsg = {
            id: crypto.randomUUID(),
            role: "user" as const,
            content: prompt,
        };
        addMessage(userMsg);

        setIsSending(true);

        const history = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        chatWithContext(prompt, locationName, history)
            .then((response) => {
                if (response) {
                    addMessage({
                        id: crypto.randomUUID(),
                        role: "assistant",
                        content: response,
                    });
                }
            })
            .catch(() => {
                addMessage({
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "Sorry, I encountered an error. Please try again.",
                });
            })
            .finally(() => {
                setIsSending(false);
                inputRef.current?.focus();
            });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            className={twMerge(
                `border-l border-slate-800 bg-slate-950 flex flex-col h-full text-slate-300`,
                className,
            )}
        >
            {/* Top Global Header */}
            <header className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/50 backdrop-blur-sm">
                <Link 
                    href="/" 
                    className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-80 transition-opacity"
                >
                    TORIBIA
                </Link>
                <button className="p-2 rounded-full hover:bg-slate-900 text-slate-400 hover:text-cyan-400 transition-colors group">
                    <User className="size-5 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                </button>
            </header>

            {/* Content Area Switcher */}
            {isLoading ? (
                // LOADING STATE
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="size-6 text-cyan-400 animate-spin" />
                    <Description className="text-xs text-cyan-400/80">
                        Fetching location info...
                    </Description>
                </div>
            ) : !locationName ? (
                // EMPTY STATE
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-6">
                    <Globe2 className="size-12 text-slate-800" />
                    <Subtitle className="text-slate-200">
                        Click a place on the globe
                    </Subtitle>
                    <Description className="text-xs text-slate-500">
                        Select any location to learn about its history,
                        culture, landmarks, and more.
                    </Description>
                </div>
            ) : (
                // CHAT INTERFACE
                <>
                    {/* Location Sub-Header */}
                    <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2 shrink-0 bg-slate-950/30">
                        <MapPin className="size-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                        <Subtitle className="text-sm font-semibold text-slate-100 tracking-wide truncate">
                            {locationName}
                        </Subtitle>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {messages.map((message, index) => (
                            <div key={message.id}>
                                <div
                                    className={twMerge(
                                        "max-w-[90%] text-sm leading-relaxed",
                                        message.role === "user"
                                            ? "ml-auto bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 shadow-lg shadow-blue-900/20"
                                            : "mr-auto text-slate-300 pl-1",
                                    )}
                                >
                                    {message.role === "assistant" ? (
                                        <Markdown
                                            components={{
                                                h1: ({ children }) => <h1 className="text-base font-bold text-slate-100 mb-2 mt-3 first:mt-0">{children}</h1>,
                                                h2: ({ children }) => <h2 className="text-sm font-bold text-slate-100 mb-1.5 mt-2.5 first:mt-0">{children}</h2>,
                                                h3: ({ children }) => <h3 className="text-sm font-semibold text-cyan-200 mb-1 mt-2 first:mt-0">{children}</h3>,
                                                p: ({ children }) => <p className="mb-2 last:mb-0 text-slate-300">{children}</p>,
                                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 marker:text-cyan-500">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 marker:text-cyan-500">{children}</ol>,
                                                li: ({ children }) => <li>{children}</li>,
                                                strong: ({ children }) => <strong className="font-semibold text-cyan-100">{children}</strong>,
                                                em: ({ children }) => <em className="italic text-slate-400">{children}</em>,
                                                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline decoration-cyan-400/30 hover:text-cyan-300 hover:decoration-cyan-300 transition-colors">{children}</a>,
                                                blockquote: ({ children }) => <blockquote className="border-l-2 border-cyan-500/50 pl-3 italic text-slate-400 my-2 bg-slate-900/50 py-1 pr-2 rounded-r">{children}</blockquote>,
                                                code: ({ children }) => <code className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs font-mono text-cyan-300">{children}</code>,
                                            }}
                                        >
                                            {message.content}
                                        </Markdown>
                                    ) : (
                                        message.content
                                    )}
                                </div>

                                {/* Suggestion chips after the last assistant message */}
                                {message.role === "assistant" &&
                                    index === messages.length - 1 &&
                                    !isSending && (
                                        <div className="flex flex-wrap gap-2 mt-4 ml-1">
                                            {suggestions.map((s) => (
                                                <button
                                                    key={s.label}
                                                    onClick={() =>
                                                        handleSuggestionClick(
                                                            s.prompt(locationName!),
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-slate-700 bg-slate-900/40 text-slate-400 hover:bg-cyan-950/30 hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-300 group"
                                                >
                                                    <s.icon className="size-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ))}

                        {isSending && (
                            <div className="flex items-center gap-2 text-slate-500 text-xs pl-1">
                                <Loader2 className="size-3 animate-spin text-cyan-500" />
                                <span className="animate-pulse">Analyzing planetary data...</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="px-3 py-3 border-t border-slate-800 shrink-0 bg-slate-950">
                        <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-cyan-500/50 focus-within:bg-slate-900 transition-colors">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Ask about ${locationName ?? "this place"}...`}
                                disabled={isSending}
                                className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-600 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isSending}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-950/30 transition-colors disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:bg-transparent"
                            >
                                <SendHorizonal className="size-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RightPanel;