'use client'

import React, { useRef } from "react";
import styles from "./styles.module.css";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
    const router = useRouter()
    const { accessToken, setAccessToken } = useGlobalContext();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleJoinChat = () => {
        console.log("Testing")
        if (inputRef.current) {
            setAccessToken(inputRef.current.value); 
        }

        router.push('/join')
    }

    return (
        <div className={styles.page}>
            <input type="text" placeholder="Token" ref={inputRef} />
            <button type="button" onClick={() => {handleJoinChat()}}>Submit</button>
        </div>
    );
};

export default Home;
