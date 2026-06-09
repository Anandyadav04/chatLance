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
  Search
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [dmMessages, setDmMessages] = useState([]);
  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, dmMessages]);

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

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConversations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDirectMessages = async (
    conversationId
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await api.get(
        `/direct-messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDmMessages(res.data);

      res.data.forEach((msg) => {

        if (!msg.isRead) {

          socket?.emit(
            "mark_dm_read",
            {
              messageId: msg._id,
            }
          );

        }

      });

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    if (!selectedConversation)
      return;

    fetchDirectMessages(
      selectedConversation._id
    );

  }, [selectedConversation]);

  useEffect(() => {
    fetchRooms();
    fetchConversations();
    const token = localStorage.getItem("token");
    const newSocket = createSocketConnection(token);
    setSocket(newSocket);
    
    newSocket.on("connect", () => console.log("Socket Connected"));
    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    newSocket.on("receive_dm", (message) => {

      setDmMessages((prev) => [
        ...prev,
        message,
      ]);

    });
    newSocket.on("dm_read", ({ messageId }) => {
      setDmMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, isRead: true }
            : msg
        )
      );

    });
    newSocket.on("dm_deleted", ({ messageId }) => {
      setDmMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                isDeleted: true,
              }
            : msg
        )
      );

    });
    newSocket.on("online_users", (users) => setOnlineUsers(users));
    newSocket.on("user_typing", (data) => setTypingUser(data.username));
    newSocket.on("user_stop_typing", () => setTypingUser(""));
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
    
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedRoom || !socket) return;
    setMessages([]);
    fetchMessages();
    socket.emit("join_room", selectedRoom?._id);
  }, [selectedRoom, socket]);

  const sendDirectMessage = () => {

    if (!message.trim())
      return;

    if (!selectedConversation)
      return;

    socket.emit("send_dm", {
      conversationId:
        selectedConversation._id,
      message,
    });

    setMessage("");

  };

  const deleteDm = (msg) => {

    socket.emit(
      "delete_dm",
      {
        messageId: msg._id,
      }
    );

  };

  const sendMessage = () => {
    if (!message.trim() || !selectedRoom) return;
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

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      if (
        selectedConversation
      ) {

        sendDirectMessage();

      } else {

        sendMessage();

      }

    }

  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedMessages = selectedConversation ? dmMessages : messages;

  return (
    <div className="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Simple Navbar */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-semibold">ChatLance</h1>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex flex-col overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Create Room */}
            {!showCreateRoom ? (
              <button
                onClick={() => setShowCreateRoom(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                New Room
              </button>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <CreateRoom onCreateRoom={createRoom} />
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="mt-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Rooms List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  All Rooms
                </h3>
                <span className="text-xs text-gray-400">{filteredRooms.length}</span>
              </div>
              <div className="space-y-1">
                {filteredRooms.map((room) => (
                  <button
                    key={room._id}
                    onClick={() => {
                      setSelectedRoom(room);
                      setSelectedConversation(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                      selectedRoom?._id === room._id
                        ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      <span>{room.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Messages */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Direct Messages
                </h3>
                <span className="text-xs text-gray-400">
                  {conversations.length}
                </span>
              </div>

              <div className="space-y-1">
                {conversations.map((conversation) => {

                  const otherUser =
                    conversation.participants.find(
                      (user) =>
                        user._id !== currentUser.id
                    );

                  return (
                    <button
                      key={conversation._id}
                      onClick={() => {
                        setSelectedConversation(
                          conversation
                        );
                        setSelectedRoom(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                        selectedConversation?._id === conversation._id
                          ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>

                        <span>
                          {otherUser?.username}
                        </span>
                      </div>
                    </button>
                  );

                })}
              </div>
            </div>

            {/* Online Users */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Online
                </h3>
                <span className="text-xs text-gray-400">{onlineUsers.length}</span>
              </div>
              <div className="space-y-2">
                {onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2 px-3 py-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full absolute bottom-0 right-0"></div>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {user.username[0].toUpperCase()}
                      </div>
                    </div>
                    <span className="text-sm">{user.username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          {/* Chat Header */}
          {selectedRoom && (
            <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedRoom
                    ? selectedRoom.name
                    : selectedConversation?.participants?.find(
                        (u) => u._id !== currentUser.id
                      )?.username}
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedRoom
                    ? `${onlineUsers.length} online • ${messages.length} messages`
                    : `${dmMessages.length} messages`}
                </p>
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {typingUser && selectedRoom && (
            <div className="px-6 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              {typingUser} is typing...
            </div>
          )}

          {/* Messages - Large and Readable */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {!selectedRoom && !selectedConversation ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Select a room to start chatting</p>
                </div>
              </div>
            ) : displayedMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No messages yet. Say hello!</p>
              </div>
            ) : (
              displayedMessages.map((msg) => (
                <div key={msg._id} className="space-y-1">
                  {/* Sender info - small */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {msg.user || msg.sender?.username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {/* Message - LARGE TEXT */}
                  {msg.isDeleted ? (
                    <div className="text-gray-400 dark:text-gray-600 italic text-base">
                      This message was deleted
                    </div>
                  ) : (
                    <div className="text-gray-900 dark:text-gray-100 text-base leading-relaxed">
                      {msg.message}
                    </div>
                  )}
                  
                  {/* Message actions */}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      {msg.isRead !== undefined && ( msg.isRead ? (
                        <>
                          <CheckCheck className="w-3 h-3" />
                          Read
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3" />
                          Sent
                        </>
                      ))}
                    </span>
                    {!msg.isDeleted && (
                      <button
                        onClick={() =>
                          selectedConversation
                            ? deleteDm(msg)
                            : deleteMessage(msg)
                        }
                        className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {(selectedRoom || selectedConversation)  && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
              <div className="flex gap-3">
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
                  className="flex-1 px-4 py-2.5 text-base border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-950 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
                <button
                  onClick={
                    selectedConversation
                      ? sendDirectMessage
                      : sendMessage
                  }
                  disabled={!message.trim()}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition flex items-center gap-2 text-sm font-medium"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;