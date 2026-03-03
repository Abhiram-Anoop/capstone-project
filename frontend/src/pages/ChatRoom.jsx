import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Send, MoreVertical, Phone, Video, Info, Paperclip, Smile, ArrowLeft } from "lucide-react";

const socket = io("https://ai-doctor-assistant-backend-ai-ml.onrender.com", {
  transports: ["websocket"], // ensures stable connection on Render
});

export default function ChatRoom() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user") || "guest";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Handle socket connection state
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // Join room
    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_typing", (data) => {
      if (data.user !== user) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socket.on("room_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("room_users");
    };
  }, [roomId, user]);

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://ai-doctor-assistant-backend-ai-ml.onrender.com/api/chat/messages/${roomId}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [roomId]);

  // Send message
  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    const msgData = {
      roomId,
      user,
      text: message,
      timestamp: Date.now(), // always use numeric timestamp
    };

    try {
      await axios.post(
        `https://ai-doctor-assistant-backend-ai-ml.onrender.com/api/chat/send`,
        msgData
      );

      socket.emit("send_message", msgData);
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { roomId, user });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isDoctor =
    user.toLowerCase().includes("doctor") || user.toLowerCase().includes("dr");

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  isDoctor ? "bg-blue-500" : "bg-green-500"
                }`}
              >
                {isDoctor ? "Dr" : "P"}
              </div>
              {connected && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Room {roomId}</h3>
              <p className="text-sm text-gray-500">
                {!connected
                  ? "Connecting..."
                  : onlineUsers.length > 0
                  ? `${onlineUsers.length} online`
                  : "No users online"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Info className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              💬
            </div>
            <h3 className="text-lg font-medium mb-2">Start the conversation</h3>
            <p className="text-sm text-center">Send a message to begin chatting</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isOwn = msg.user === user;
              const showAvatar =
                idx === 0 || messages[idx - 1].user !== msg.user;

              return (
                <div
                  key={idx}
                  className={`flex ${
                    isOwn ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`flex max-w-xs lg:max-w-md ${
                      isOwn ? "flex-row-reverse" : "flex-row"
                    } items-end space-x-2`}
                  >
                    {!isOwn && showAvatar && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                          msg.user.toLowerCase().includes("doctor")
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      >
                        {msg.user.toLowerCase().includes("doctor")
                          ? "Dr"
                          : msg.user.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!isOwn && !showAvatar && <div className="w-8"></div>}

                    <div
                      className={`relative px-4 py-2 rounded-2xl ${
                        isOwn
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                      }`}
                    >
                      {!isOwn && showAvatar && (
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          {msg.user}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div
                        className={`text-xs mt-1 ${
                          isOwn ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-semibold">
                    ...
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={sendMessage} className="flex items-end space-x-3">
          <div className="flex space-x-2">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Smile className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 overflow-y-auto"
              rows="1"
              style={{
                minHeight: "44px",
                height: "auto",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              message.trim()
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send • Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}
