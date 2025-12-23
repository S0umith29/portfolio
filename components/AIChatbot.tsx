"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to Sowmith's portfolio! Need help? Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (you can replace this with actual API call)
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("experience") || lowerInput.includes("work")) {
      return "Sowmith is currently an AI Research Intern at Old Dominion University (Jan 2025 - Present). Previously, he worked as a Graduate Research Assistant (Oct 2023 - May 2025) and as a DevOps Engineer Intern at Campaign Innovations (July 2022 - September 2022).";
    }

    if (lowerInput.includes("skill") || lowerInput.includes("technology")) {
      return "Sowmith specializes in AI/ML (PyTorch, TensorFlow, RAG), MLOps (Kubernetes, Docker, Terraform, Jenkins), Cloud platforms (GCP, AWS), and Programming languages (Python, Go, SQL, JavaScript). He's also CKA certified!";
    }

    if (lowerInput.includes("education") || lowerInput.includes("degree")) {
      return "Sowmith has an M.Sc. in Computer Science from Old Dominion University (Aug 2023 - May 2025) and a B.Tech in Computer Science from National Institute of Technology Puducherry (Aug 2019 - May 2023).";
    }

    if (lowerInput.includes("project") || lowerInput.includes("medsim")) {
      return "MedSim is a comprehensive medical simulation platform with AI-powered evaluation capabilities. It features microservices architecture with React.js & FastAPI, Hybrid RAG pipeline using Vertex AI, and automated OSCE-style evaluation engine.";
    }

    if (lowerInput.includes("contact") || lowerInput.includes("email") || lowerInput.includes("reach")) {
      return "You can reach Sowmith at soumith.odu@gmail.com or connect on LinkedIn at linkedin.com/in/soumith29. His phone number is +1 (757) 798-9998.";
    }

    if (lowerInput.includes("certification") || lowerInput.includes("certificate")) {
      return "Sowmith holds several certifications including CKA (Certified Kubernetes Administrator) from The Linux Foundation, Networking Essentials, and Introduction to Cybersecurity Tools & Cyber Attacks.";
    }

    if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      return "Hello! I'm here to help you learn more about Sowmith Kuppa. You can ask me about his experience, skills, projects, education, or how to contact him!";
    }

    return "I can help you learn about Sowmith's experience, skills, projects, education, certifications, or how to contact him. What would you like to know?";
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-foreground text-background rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
        aria-label="Open AI Assistant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="sr-only">AI Assistant</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-background border border-border rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-foreground text-background p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-background/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold">AI Assistant</h4>
                <p className="text-xs opacity-90">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-70 transition-opacity"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-border text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-border text-foreground rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-border border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground"
              />
              <button
                onClick={handleSend}
                className="bg-foreground text-background rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}




