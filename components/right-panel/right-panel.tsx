"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { Subtitle, Description } from "../reusables/texts";
import { useLocation } from "@/contexts/location-context";
import { chatWithContext } from "@/app/actions/chat";
import { SendHorizonal, MapPin, Loader2, Globe2, Compass, UtensilsCrossed, Landmark } from "lucide-react";
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

    // Empty state — no location selected
    if (!locationName && !isLoading) {
        return (
            <div
                className={twMerge(
                    `border-l flex flex-col items-center justify-center gap-3 text-center p-6`,
                    className,
                )}
            >
                <Globe2 className="size-10 text-neutral-300" />
                <Subtitle className="text-neutral-400">
                    Click a place on the globe
                </Subtitle>
                <Description className="text-xs text-neutral-400">
                    Select any location to learn about its history,
                    culture, landmarks, and more.
                </Description>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div
                className={twMerge(
                    `border-l flex flex-col items-center justify-center gap-3`,
                    className,
                )}
            >
                <Loader2 className="size-6 text-neutral-400 animate-spin" />
                <Description className="text-xs text-neutral-400">
                    Fetching location info...
                </Description>
            </div>
        );
    }

    return (
        <div
            className={twMerge(
                `border-l flex flex-col h-full`,
                className,
            )}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center gap-2 shrink-0">
                <MapPin className="size-4 text-blue-600" />
                <Subtitle className="text-sm truncate">
                    {locationName}
                </Subtitle>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {messages.map((message, index) => (
                    <div key={message.id}>
                        <div
                            className={twMerge(
                                "max-w-[90%] text-sm leading-relaxed",
                                message.role === "user"
                                    ? "ml-auto bg-blue-600 text-white rounded-2xl rounded-br-sm px-3 py-2"
                                    : "mr-auto text-neutral-700",
                            )}
                        >
                            {message.role === "assistant" ? (
                                <Markdown
                                    components={{
                                        h1: ({ children }) => <h1 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-sm font-bold mb-1.5 mt-2.5 first:mt-0">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h3>,
                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                        li: ({ children }) => <li>{children}</li>,
                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                        em: ({ children }) => <em className="italic">{children}</em>,
                                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">{children}</a>,
                                        blockquote: ({ children }) => <blockquote className="border-l-2 border-neutral-300 pl-3 italic text-neutral-500 my-2">{children}</blockquote>,
                                        code: ({ children }) => <code className="bg-neutral-100 rounded px-1 py-0.5 text-xs font-mono">{children}</code>,
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
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {suggestions.map((s) => (
                                        <button
                                            key={s.label}
                                            onClick={() =>
                                                handleSuggestionClick(
                                                    s.prompt(locationName!),
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-neutral-200 text-neutral-600 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                                        >
                                            <s.icon className="size-3" />
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                    </div>
                ))}

                {isSending && (
                    <div className="flex items-center gap-2 text-neutral-400 text-xs">
                        <Loader2 className="size-3 animate-spin" />
                        Thinking...
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-3 py-3 border-t shrink-0">
                <div className="flex items-center gap-2 bg-neutral-100 rounded-xl px-3 py-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Ask about ${locationName ?? "this place"}...`}
                        disabled={isSending}
                        className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-400 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isSending}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:hover:text-neutral-400 disabled:hover:bg-transparent"
                    >
                        <SendHorizonal className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RightPanel;