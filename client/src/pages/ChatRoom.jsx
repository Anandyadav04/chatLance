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
  Search,
  ArrowLeft
} from "lucide-react";

const ChatRoom = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [roomSearchQuery, setRoomSearchQuery] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [dmMessages, setDmMessages] = useState([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, dmMessages]);

  useEffect(() => {
    selectedConversationRef.current =
      selectedConversation;
  }, [selectedConversation]);

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
      const savedRoom =
        localStorage.getItem(
          "selectedRoom"
        );

      if (savedRoom) {

        const room =
          res.data.find(
            (r) =>
              r._id === savedRoom
          );

        if (room) {
          setSelectedRoom(room);
        }

      } else if (
        res.data.length > 0
      ) {

        setSelectedRoom(
          res.data[0]
        );

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
        senderId: msg.sender._id,
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

  const createConversation = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/conversations",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchConversations();

      setSelectedConversation(res.data);
      setSelectedRoom(null);

      setShowUserSearch(false);
      setSearchResults([]);
      setSearchQuery("");

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

      const savedConversation =
        localStorage.getItem(
          "selectedConversation"
        );

      if (savedConversation) {

        const conversation =
          res.data.find(
            (c) =>
              c._id ===
              savedConversation
          );

        if (conversation) {

          setSelectedConversation(
            conversation
          );

          setSelectedRoom(null);

        }

      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDirectMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/direct-messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDmMessages(res.data);

      const unreadMessages = res.data.filter(
        msg => !msg.isRead && msg.sender?._id !== currentUser.id
      );

      if (unreadMessages.length > 0) {
        unreadMessages.forEach((msg) => {
          socket?.emit("mark_dm_read", {
            messageId: msg._id,
            conversationId: conversationId,
          });
        });
        
      }

    } catch (error) {
      console.error(error);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/conversations/unread", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUnreadCounts(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedConversation || !socket) return;

    socket.emit("join_conversation", selectedConversation._id);
    fetchDirectMessages(selectedConversation._id);
  }, [selectedConversation, socket]);

  useEffect(() => {
    fetchRooms();
    fetchConversations();
    fetchUnreadCounts();
    const token = localStorage.getItem("token");
    const newSocket = createSocketConnection(token);
    setSocket(newSocket);
    
    newSocket.on("connect", () => console.log("Socket Connected"));
    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    
    newSocket.on("receive_dm", (message) => {
      setDmMessages((prev) => [...prev, message]);

      fetchUnreadCounts();

      if (
        selectedConversationRef.current &&
        selectedConversationRef.current._id === message.conversationId &&
        message.sender._id !== currentUser.id
      ) {
        newSocket.emit("mark_dm_read", {
          messageId: message._id,
          conversationId: message.conversationId,
        });
      }
    });

  newSocket.on("dm_read", ({ messageId, conversationId, readBy }) => {

    // Update the specific message to show as read
    setDmMessages((prevMessages) => {
      let updated = false;
      const newMessages = prevMessages.map((msg) => {
        if (msg._id === messageId) {
          console.log(`Marking message ${messageId} as read`);
          updated = true;
          return { ...msg, isRead: true };
        }
        return msg;
      });
      
      if (updated) {
      } else {
        console.log(`Message ${messageId} not found in current messages`);
      }
      
      return newMessages;
    });
    
    // Clear unread count for this conversation
    setUnreadCounts((prev) => ({
      ...prev,
      [conversationId]: 0
    }));
  });

  newSocket.on(
    "unread_count_update",
    ({
      conversationId,
      unreadCount,
    }) => {

      setUnreadCounts(
        (prev) => ({
          ...prev,
          [conversationId]:
            unreadCount,
        })
      );

    }
  );
  newSocket.on("dm_deleted", ({ messageId }) => {
    setDmMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId
          ? { ...msg, isDeleted: true }
          : msg
      )
    );
  });
    
    newSocket.on("user_dm_typing", (data) => {
      setTypingUser(data.username);
    });
    
    newSocket.on("user_dm_stop_typing", () => {
      setTypingUser("");
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

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const sendDirectMessage = () => {
    if (!message.trim()) return;
    if (!selectedConversation) return;

    socket.emit("send_dm", {
      conversationId: selectedConversation._id,
      message,
    });

    setMessage("");
  };

  const deleteDm = (msg) => {
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    socket.emit("delete_dm", {
      messageId: msg._id,
      conversationId: selectedConversation?._id
    });
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
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

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
      if (selectedConversation) {
        sendDirectMessage();
      } else {
        sendMessage();
      }
    }
  };

  const searchUsers = async (query) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/users/search?q=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(roomSearchQuery.toLowerCase())
  );

  const displayedMessages = selectedConversation ? dmMessages : messages;

  return (
    <div className="h-screen bg-white  text-gray-900  flex flex-col">
      {/* Simple Navbar */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200  bg-white ">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-semibold">ChatLance</h1>
        </div>
<div className="relative">

  <button
    onClick={() =>
      setShowUserMenu(
        !showUserMenu
      )
    }
    className="px-3 py-2 bg-gray-100  rounded-lg flex items-center gap-2 hover:bg-gray-200  transition"
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 border-none flex items-center justify-center text-white text-sm font-semibold">
      {currentUser?.username?.charAt(0).toUpperCase()}
    </div>

    <span className="text-sm font-medium">
      {currentUser?.username}
    </span>

    <svg
      className={`w-4 h-4 transition ${
        showUserMenu
          ? "rotate-180"
          : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>

  {showUserMenu && (
    <div className="absolute right-0 mt-2 w-64 bg-white  rounded-xl shadow-xl border border-gray-200  overflow-hidden z-50">

      <div className="p-4 border-b border-gray-200 ">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 border-none flex items-center justify-center text-white font-bold">
            {currentUser?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold">
              {currentUser?.username}
            </p>

            <p className="text-xs text-gray-500">
              {currentUser?.email}
            </p>
          </div>

        </div>

      </div>

      <button
        onClick={() => {
          setShowUserMenu(false);
          navigate("/profile");
        }}
        className="w-full px-4 py-3 text-left hover:bg-gray-100 "
      >
        👤 Profile
      </button>

      <button
        className="w-full px-4 py-3 text-left hover:bg-gray-100 "
      >
        ⚙️ Settings
      </button>

      <button
        onClick={logout}
        className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 "
      >
        🚪 Logout
      </button>

    </div>
  )}

</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-gray-200  bg-gray-50  flex-col overflow-y-auto ${(selectedRoom || selectedConversation) ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 space-y-6">
            {/* Create Room */}
            {!showCreateRoom ? (
              <button
                onClick={() => setShowCreateRoom(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 border-none hover:from-indigo-600 hover:to-purple-700 hover:shadow-md text-white rounded-lg transition text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                New Room
              </button>
            ) : (
              <div className="bg-white  border border-gray-200  rounded-lg p-4">
                <CreateRoom onCreateRoom={createRoom} />
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="mt-3 text-sm text-gray-500 hover:text-gray-700 "
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
                value={roomSearchQuery}
                onChange={(e) => setRoomSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200  rounded-lg bg-white  focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Rooms List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-500  uppercase tracking-wide">
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

                      localStorage.setItem("selectedRoom", room._id);
                      localStorage.removeItem("selectedConversation");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                      selectedRoom?._id === room._id
                        ? "bg-indigo-50  text-indigo-600 "
                        : "hover:bg-gray-100 "
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
            <button
              onClick={() => setShowUserSearch(true)}
              className="w-full mb-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 border-none text-white rounded-lg text-sm"
            >
              New DM
            </button>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-500  uppercase tracking-wide">
                  Direct Messages
                </h3>
                <span className="text-xs text-gray-400">
                  {conversations.length}
                </span>
              </div>

              <div className="space-y-1">
                {conversations.map((conversation) => {
                  const otherUser = conversation.participants.find(
                    (user) => user._id !== currentUser._id
                  );

                  return (
                    <button
                      key={conversation._id}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setSelectedRoom(null);

                        localStorage.setItem("selectedConversation", conversation._id);
                        localStorage.removeItem("selectedRoom");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                        selectedConversation?._id === conversation._id
                          ? "bg-purple-50  text-purple-600 "
                          : "hover:bg-gray-100 "
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>

                        <div className="flex items-center justify-between w-full">
                          <span>{otherUser?.username}</span>

                          {unreadCounts[conversation._id] > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {unreadCounts[conversation._id]}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Online Users */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-500  uppercase tracking-wide">
                  Online
                </h3>
                <span className="text-xs text-gray-400">{onlineUsers.length}</span>
              </div>
              <div className="space-y-2">
                {onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2 px-3 py-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full absolute bottom-0 right-0"></div>
                      <div className="w-8 h-8 bg-gray-200  rounded-full flex items-center justify-center text-sm font-medium">
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
        <div className={`flex-1 flex-col bg-white  ${(!selectedRoom && !selectedConversation) ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Header */}
          {(selectedRoom || selectedConversation) && (
            <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-200  bg-white ">
              <div className="flex items-center gap-2">
                <button 
                  className="md:hidden p-2 -ml-2 mr-1 rounded-lg hover:bg-gray-100  text-gray-500 transition-colors"
                  onClick={() => {
                    setSelectedRoom(null);
                    setSelectedConversation(null);
                    localStorage.removeItem("selectedRoom");
                    localStorage.removeItem("selectedConversation");
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedRoom
                      ? selectedRoom.name
                      : selectedConversation?.participants?.find(
                          (u) => u._id !== currentUser.id
                        )?.username}
                  </h2>

                  <p className="text-xs text-gray-500 ">
                    {selectedRoom
                      ? `${onlineUsers.length} online • ${messages.length} messages`
                      : `${dmMessages.length} messages`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {typingUser && (selectedRoom || selectedConversation) && (
            <div className="px-6 py-2 text-sm text-gray-500  border-b border-gray-200 ">
              {typingUser} is typing...
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {!selectedRoom && !selectedConversation ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300  mx-auto mb-3" />
                  <p className="text-gray-500 ">Select a room to start chatting</p>
                </div>
              </div>
            ) : displayedMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 ">No messages yet. Say hello!</p>
              </div>
            ) : (
              displayedMessages.map((msg) => (
                <div key={msg._id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 ">
                      {msg.user || msg.sender?.username}
                    </span>
                    <span className="text-xs text-gray-500 ">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {msg.isDeleted ? (
                    <div className="text-gray-400  italic text-base">
                      This message was deleted
                    </div>
                  ) : (
                    <div className="text-gray-900  text-base leading-relaxed">
                      {msg.message}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      {msg.isRead !== undefined && (msg.isRead ? (
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
                      (selectedConversation
                        ? msg.sender?._id === currentUser.id
                        : msg.senderId === currentUser.id
                      ) && (
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
                      )
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {(selectedRoom || selectedConversation) && (
            <div className="border-t border-gray-200  p-4 bg-white ">
              <div className="flex gap-3">
                <textarea
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (selectedConversation) {
                      socket?.emit("dm_typing", {
                        conversationId: selectedConversation._id,
                      });
                    } else {
                      socket?.emit("typing", selectedRoom?._id);
                    }
                    if (typingTimeout) clearTimeout(typingTimeout);
                    const timeout = setTimeout(() => {
                      if (selectedConversation) {
                        socket?.emit("dm_stop_typing", {
                          conversationId: selectedConversation._id,
                        });
                      } else {
                        socket?.emit("stop_typing", selectedRoom?._id);
                      }
                    }, 1000);
                    setTypingTimeout(timeout);
                  }}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  className="flex-1 px-4 py-2.5 text-base border border-gray-200  rounded-lg bg-gray-50  focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
                <button
                  onClick={selectedConversation ? sendDirectMessage : sendMessage}
                  disabled={!message.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 border-none hover:from-indigo-600 hover:to-purple-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition flex items-center gap-2 text-sm font-medium"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          )}
          
          {/* Search users */}
          {showUserSearch && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white  p-4 rounded-lg w-96">
                <h2 className="text-lg font-semibold mb-3">
                  Start New Conversation
                </h2>

                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full border rounded-lg px-3 py-2"
                />

                <div className="mt-3 space-y-2">
                  {searchResults.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => createConversation(user._id)}
                      className="w-full text-left p-2 border rounded-lg hover:bg-gray-100 "
                    >
                      {user.username}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setShowUserSearch(false);
                    setSearchResults([]);
                    setSearchQuery("");
                  }}
                  className="mt-3 px-3 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Close
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