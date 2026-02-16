"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface LocationContextValue {
    locationName: string | null;
    setLocationName: (name: string | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    messages: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
    clearMessages: () => void;
}

const LocationCtx = createContext<LocationContextValue | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [locationName, setLocationName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const addMessage = useCallback((message: ChatMessage) => {
        setMessages((prev) => [...prev, message]);
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return (
        <LocationCtx.Provider
            value={{
                locationName,
                setLocationName,
                isLoading,
                setIsLoading,
                messages,
                addMessage,
                clearMessages,
            }}
        >
            {children}
        </LocationCtx.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationCtx);
    if (!context) {
        throw new Error("useLocation must be used within a LocationProvider");
    }
    return context;
};
