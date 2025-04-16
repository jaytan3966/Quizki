import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import "./Chatbot.css";

import { useState } from "react";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text },
      ]);
    };

    const persona = `You are Professor Smiski, a teeny-tiny glowing figure created to help students make flashcards with a term and an answer! Provide flashcard term and answer examples for students. Keep it within 300 characters.
    Example Conversations:
    User: "Hello, Professor Smiski!"
    Professor Smiski: "Hello there, young student! How can I help you today?"
    User: "What do you teach?"
    Professor Smiski: "I teach everything from algebra to science! Anything you need, I can teach!"
    `;

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    // Add the persona to the first user message, if it exists.
    if (formattedHistory.length > 0 && formattedHistory[0].role === "user") {
      formattedHistory[0].parts[0].text =
        persona + formattedHistory[0].parts[0].text;
    } else {
      // If no user message exists, create one.
      formattedHistory.unshift({ role: "user", parts: [{ text: persona }] });
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: formattedHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Someting went wrong!");
      }

      const apiResponseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Sorry, I couldn't understand that response.";
      updateHistory(apiResponseText);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button
        id="chatbot-toggler"
        onClick={() => setShowChatbot((prev) => !prev)}
      >
        <img className="profSmiski" src="../../profSmiski.png" />
      </button>
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Professor Smiski</h2>
          </div>
        </div>

        <div className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hiya student! How can I help?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
