"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<{ author: string; bot: string }[]>(
    []
  );
  const feedRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getResponse = async () => {
    setText("");
    setLoading(true);

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
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Error fetching response:", error);
    }
  };

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex justify-center items-center p-4 my-[7vh]">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-semibold ">Chat With</h3>
          <h2 className="text-5xl font-bold mb-4">PaLM 2 Bot</h2>
          <p className="mt-6">Type in English.</p>
        </div>
        <div className=" bg-white rounded-2xl shadow-xl mb-4 overflow-hidden border-2 feed">
          <div ref={feedRef} className="p-6 overflow-y-auto h-96">
            {messages.map((message, index) => (
              <div key={index} className="mb-4 last:mb-0">
                {message.author && (
                  <div className="w-64 md:w-[50%] max-w-full p-5 my-2 mx-6 rounded-lg shadow-md text-gray-700 bg-green-200 ml-auto">
                    {message.author}
                  </div>
                )}
                {message.bot && (
                  <div className="w-64 md:w-[50%] max-w-full p-5 my-2 mx-6 rounded-lg shadow-md text-gray-700 bg-gray-100">
                    {message.bot}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="gap-2 flex mt-10">
          <Textarea
            className="w-full p-3 rounded-lg border border-gray-400 bg-white text-gray-700 resize-none hover:resize overflow-y-auto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                getResponse();
              }
            }}
          />
          <Button
            onClick={getResponse}
            disabled={loading}
            className="md:h-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            {loading ? "Loading..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
