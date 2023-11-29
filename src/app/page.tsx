"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<{ author: string; bot: string }[]>(
    []
  );
  const getResponse = async () => {
    try {
      const response = await fetch(`http://localhost:8000/prompt/${text}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setMessages([
        ...messages,
        {
          author: data.messages[0].content,
          bot: data.candidates[0].content,
        },
      ]);
      setText("");
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  useEffect(() => {
    const feed = document.querySelector(".feed");
    if (feed) {
      const observer = new MutationObserver(() => {
        feed.scrollTop = feed.scrollHeight;
      });
      observer.observe(feed, { childList: true, subtree: true });

      // Clean up
      return () => observer.disconnect();
    }
  }, []);
  return (
    <div>
      <div className="chat-bot">
        <div className="chat-header">
          <div className="info-container">
            <h3>Chat With</h3>
            <h2>PaLM 2 Bot</h2>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="rgb(6, 120, 84)"
              fillOpacity="1"
              d="M0,224L60,218.7C120,213,240,203,360,186.7C480,171,600,149,720,154.7C840,160,960,192,1080,186.7C1200,181,1320,139,1380,117.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg>
        </div>
        <div className="feed">
          {messages.map((message, index) => (
            <div key={index}>
              <div className="question bubble">{message.author}</div>
              <div className="response bubble">{message.bot}</div>
            </div>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              getResponse();
            }
          }}
        />
        <button onClick={getResponse}>→</button>
      </div>
    </div>
  );
}
