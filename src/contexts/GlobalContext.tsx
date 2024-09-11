'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface IGlobalContext {
    accessToken: string;
    setAccessToken: React.Dispatch<React.SetStateAction<string>>;
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

type Message = {
    message: string,
    isLeft: boolean,
}

const GlobalContextDefault: IGlobalContext = {
    accessToken: '',
    setAccessToken: () => {},
    messages: [],
    setMessages: () => {}
};

const GlobalContext = createContext<IGlobalContext>(GlobalContextDefault);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    return (
        <GlobalContext.Provider value={{ accessToken, setAccessToken, messages, setMessages }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
