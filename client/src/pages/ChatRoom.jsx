import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../socket/socket";
import api from "../api/axios.js";
import RoomList from "../components/Room/RoomList";
import CreateRoom from "../components/Room/CreateRoom";
import { useNavigate } from "react-router-dom";
import { 
  Send, 
  LogOut, 
  Users, 
  MessageSquare, 
  CheckCheck, 
  Check, 
  Trash2,
  Plus,
  Hash,
  MoreVertical,
  Search,
  Smile,
  Paperclip,
  Mic,
  ArrowLeft
} from "lucide-react";

const ChatRoom = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create new room
  const createRoom = async (roomData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/rooms", roomData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms((prev) => [...prev, res.data]);
      setSelectedRoom(res.data);
      setShowCreateRoom(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all rooms
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data);
      if (res.data.length > 0) {
        setSelectedRoom(res.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch room messages
  const fetchMessages = async () => {
    if (!selectedRoom) return;
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/messages/${selectedRoom._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedMessages = res.data.map((msg) => ({
        _id: msg._id,
        user: msg.sender.username,
        message: msg.message,
        createdAt: msg.createdAt,
        isRead: msg.isRead,
        isDeleted: msg.isDeleted,
      }));
      formattedMessages.forEach((msg) => {
        if (!msg.isRead) {
          socket?.emit("mark_read", {
            roomId: selectedRoom._id,
            messageId: msg._id,
          });
        }
      });
      setMessages(formattedMessages);
    } catch (error) {
      console.error(error);
    }
  };

  // Create socket connection ONCE
  useEffect(() => {
    fetchRooms();
    const token = localStorage.getItem("token");
    const newSocket = createSocketConnection(token);
    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Socket Connected");
    });
    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    newSocket.on("online_users", (users) => {
      setOnlineUsers(users);
    });
    newSocket.on("user_typing", (data) => {
      setTypingUser(data.username);
    });
    newSocket.on("user_stop_typing", () => {
      setTypingUser("");
    });
    newSocket.on("message_read", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    });
    newSocket.on("message_deleted", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isDeleted: true } : msg
        )
      );
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // When room changes
  useEffect(() => {
    if (!selectedRoom || !socket) return;
    setMessages([]);
    fetchMessages();
    socket.emit("join_room", selectedRoom?._id);
  }, [selectedRoom, socket]);

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;
    if (!selectedRoom) return;
    socket.emit("send_message", {
      roomId: selectedRoom._id,
      message,
    });
    setMessage("");
  };

  const deleteMessage = (msg) => {
    socket.emit("delete_message", {
      messageId: msg._id,
      roomId: selectedRoom._id,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    socket?.disconnect();
    navigate("/login");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col overflow-hidden">
      {/* Modern Navbar */}
      <div className="h-16 px-6 flex items-center justify-between bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            ChatLance
          </h1>
        </div>
        <button
          onClick={logout}
          className="group px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
        >
          <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
          <span className="text-red-400 group-hover:text-red-300">Logout</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Modern Drawer */}
        <div className={`
          ${isSidebarOpen ? 'w-80' : 'w-0'} 
          bg-gray-900/30 backdrop-blur-xl border-r border-gray-700/50 
          transition-all duration-300 ease-in-out overflow-hidden
          flex flex-col
        `}>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Create Room Button */}
            <div className="space-y-3">
              {!showCreateRoom ? (
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="w-full group flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Room</span>
                </button>
              ) : (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <CreateRoom onCreateRoom={createRoom} />
                  <button
                    onClick={() => setShowCreateRoom(false)}
                    className="mt-2 text-sm text-gray-400 hover:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Search Rooms */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 pl-10 pr-4 py-2 rounded-xl border border-gray-700 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>

            {/* Rooms List */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Rooms ({filteredRooms.length})
              </h3>
              <RoomList
                rooms={filteredRooms}
                selectedRoom={selectedRoom}
                onSelectRoom={setSelectedRoom}
              />
            </div>

            {/* Online Users */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Online ({onlineUsers.length})
              </h3>
              <div className="space-y-2">
                {onlineUsers.map((user) => (
                  <div
                    key={user.id}
                    className="group flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300"
                  >
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full absolute bottom-0 right-0 ring-2 ring-gray-900"></div>
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {user.username[0].toUpperCase()}
                      </div>
                    </div>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="h-16 px-6 flex items-center justify-between bg-gray-900/30 backdrop-blur-xl border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <ArrowLeft className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
              </button>
              {selectedRoom ? (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{selectedRoom.name}</h2>
                    <p className="text-xs text-gray-400">
                      {onlineUsers.length} online • {messages.length} messages
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold">Welcome to ChatLance</h2>
                  <p className="text-xs text-gray-400">Select a room to start chatting</p>
                </div>
              )}
            </div>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Typing Indicator */}
          {typingUser && selectedRoom && (
            <div className="h-8 px-6 flex items-center">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs text-indigo-400 font-medium">
                  {typingUser} is typing...
                </span>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && selectedRoom ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-400">No messages yet</h3>
                <p className="text-sm text-gray-500 mt-1">Be the first to send a message!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className="group flex gap-3 animate-fade-in"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold">
                    {msg.user[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">{msg.user}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`
                      relative bg-gray-800/50 rounded-2xl px-4 py-2 max-w-md
                      ${msg.isDeleted ? 'opacity-60' : 'hover:bg-gray-800/70 transition'}
                    `}>
                      {msg.isDeleted ? (
                        <em className="text-sm text-gray-400">This message was deleted</em>
                      ) : (
                        <p className="text-sm break-words">{msg.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        {msg.isRead ? (
                          <>
                            <CheckCheck className="w-3 h-3 text-indigo-400" />
                            <span className="text-indigo-400">Read</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Sent</span>
                          </>
                        )}
                      </span>
                      {!msg.isDeleted && (
                        <button
                          onClick={() => deleteMessage(msg)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Modern */}
          {selectedRoom && (
            <div className="border-t border-gray-700/50 p-4 bg-gray-900/30 backdrop-blur-xl">
              <div className="flex gap-3 items-end">
                <button className="p-2 hover:bg-gray-800 rounded-xl transition text-gray-400 hover:text-indigo-400">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-xl transition text-gray-400 hover:text-indigo-400">
                  <Smile className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      socket?.emit("typing", selectedRoom?._id);
                      if (typingTimeout) clearTimeout(typingTimeout);
                      const timeout = setTimeout(() => {
                        socket?.emit("stop_typing", selectedRoom?._id);
                      }, 1000);
                      setTypingTimeout(timeout);
                    }}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    className="w-full bg-gray-800/50 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-y-auto max-h-32"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-xl transition text-gray-400 hover:text-indigo-400 lg:hidden">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.8);
        }
      `}</style>
    </div>
  );
};

export default ChatRoom;