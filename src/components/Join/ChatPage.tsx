'use client'
import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css'
import { useGlobalContext } from '@/contexts/GlobalContext';
import { io, Socket } from 'socket.io-client';
import TypingAnimation from '../TypingAnimation/TypingAnimation';

type Message = {
    message: string,
    isLeft: boolean,
}

const ChatPage = () => {

    const { accessToken, messages, setMessages} = useGlobalContext();
    const [ isTyping, setIsTyping ] = useState<boolean>(false);
    const messageInput = useRef<HTMLInputElement>(null);
    const toInput = useRef<HTMLInputElement>(null);
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if(isTyping === true) {
            setTimeout(() => {
                setIsTyping(false);
            }, 1500)
        }
    }, [isTyping] )

    useEffect(() => {
        socketRef.current = io('http://localhost:8000', {
        query: {
          token: accessToken,
        }
    });

    socketRef.current.on('connect', () => {
        console.log('Đã kết nối đến server');
        const payload = {
            privateChatId: "66e014a9b4f86eddc5a0f7cf"
        }
        socketRef.current?.emit('joinPrivateChat', payload);
    });

    socketRef.current.on('message', (data) => {
        console.log('Nhận tin nhắn từ server:', data);
    });

    socketRef.current.on('chatPrivateMessage', (data) => {
        console.log('before message:', messages);
        setMessages((prevMessages) => {
            const newMessages = [...prevMessages, {
                message: data.content,
                isLeft: true,
            }];
            console.log('Updated messages:', newMessages);
            return newMessages;
        });
        console.log("You have received new messages");
        console.log(data);
    });

    socketRef.current.on('connect_error', (err) => {
        console.error('Lỗi kết nối:', err);
    });

    socketRef.current.on('getHistory', (data) => {
        console.log('hey hey hey');
        console.log(data);
    });

    socketRef.current.on('typing', () => {
        setIsTyping(true);
    });

    // Cleanup when component unmounts
    return () => {
        socketRef.current?.disconnect();
    };
}, []);

const handleTyping = () => {
    socketRef.current?.emit('typing', {privateChatId: "66e014a9b4f86eddc5a0f7cf"});
}

useEffect(() => {
    console.log(messages)
  }, [messages]);

const sendMessage = () => {
    const newMessages = [...messages, {
        message: messageInput.current?.value ?? '',
        isLeft: false,
    }];
    setMessages(newMessages);

    socketRef.current?.emit('chatPrivateMessage', {
        content: messageInput.current?.value,
        to: toInput.current?.value,
        privateChatId: "66e014a9b4f86eddc5a0f7cf"
    });
}
    return (
        <div className={styles.main_container}>
            <div className={styles.chat_container}>
                {
                    messages.map((message,index) => {
                        return (
                            <div key={index} className={message.isLeft ? styles.left : styles.right}> {message.message}</div>
                        )
                    })
                }
                {isTyping ? 
                <div className={styles.left}>
                    <TypingAnimation/>
                </div> : <></>}
            </div>
            <div className={styles.send_message}>
                <input 
                    type="text" 
                    placeholder='Message' 
                    ref={messageInput}
                    onChange={() => { handleTyping()}}
                />
                <input type="text" placeholder='To' ref={toInput}/>
                <button onClick={() => {
                    sendMessage();
                }}>Send</button>
            </div>
        </div>
    )
}

export default ChatPage;