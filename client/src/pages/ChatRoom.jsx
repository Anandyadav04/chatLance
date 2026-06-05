import { useEffect, useState } from "react";
import { createSocketConnection } from "../socket/socket";
import api from "../api/axios.js";
import RoomList from "../components/Room/RoomList";
import CreateRoom from "../components/Room/CreateRoom";

const ChatRoom = () => {

  const [socket, setSocket] = useState(null);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [rooms, setRooms] = useState([]);

  const [selectedRoom, setSelectedRoom] =
    useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [typingUser, setTypingUser] = useState("");

  const [typingTimeout, setTypingTimeout] = useState(null);

  // create new room
  const createRoom =
    async (roomData) => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.post(
        "/rooms",
        roomData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setRooms((prev) => [
        ...prev,
        res.data,
      ]);

      setSelectedRoom(
        res.data
      );

    } catch (error) {

      console.error(error);

    }

  };

  // Fetch all rooms
  const fetchRooms = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/rooms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        `/messages/${selectedRoom._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedMessages =
        res.data.map((msg) => ({
          _id: msg._id,
          user:
            msg.sender.username,
          message:
            msg.message,
          createdAt:
            msg.createdAt,
          isRead:
            msg.isRead,
        }));

      formattedMessages.forEach(
        (msg) => {

          if (!msg.isRead) {

            socket?.emit(
              "mark_read",
              {
                roomId:
                  selectedRoom._id,
                messageId:
                  msg._id,
              }
            );

          }

        }
      );

      setMessages(formattedMessages);

    } catch (error) {

      console.error(error);

    }
  };

  // Create socket connection ONCE
  useEffect(() => {

    fetchRooms();

    const token =
      localStorage.getItem("token");

    const newSocket =
      createSocketConnection(token);

    setSocket(newSocket);

    newSocket.on("connect", () => {

      console.log(
        "Socket Connected"
      );

    });

    newSocket.on(
      "receive_message",
      (data) => {

        setMessages((prev) => [
          ...prev,
          data,
        ]);

      }
    );

    newSocket.on(
      "online_users",
      (users) => {

        setOnlineUsers(users);

      }
    );

    newSocket.on(
      "user_typing",
      (data) => {

        setTypingUser(
          data.username
        );

      }
    );

    newSocket.on(
      "user_stop_typing",
      () => {

        setTypingUser("");

      }
    );

    newSocket.on(
      "message_read",
      ({ messageId }) => {

        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? {
                  ...msg,
                  isRead: true,
                }
              : msg
          )
        );

      }
    );

    return () => {

      newSocket.disconnect();

    };

  }, []);

  // When room changes
  useEffect(() => {

    if (!selectedRoom || !socket)
      return;

    setMessages([]);

    fetchMessages();

    socket.emit(
      "join_room",
      selectedRoom?._id
    );

  }, [selectedRoom, socket]);

  // Send message
  const sendMessage = () => {

    if (!message.trim())
      return;

    if (!selectedRoom)
      return;

    socket.emit(
      "send_message",
      {
        roomId: selectedRoom._id,
        message,
      }
    );

    setMessage("");

  };

  return (
    <div>

      <h1>Chat Room</h1>

      <CreateRoom
        onCreateRoom={
          createRoom
        }
      />

      <RoomList
        rooms={rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={setSelectedRoom}
      />

      <h3>Online Users</h3>

      {onlineUsers.map((user) => (

        <div
          key={user.id}
        >
          🟢 {user.username}
        </div>

      ))}

      <h2>
        {selectedRoom
          ? selectedRoom.name
          : "Select a room"}
      </h2>

      {typingUser && (
        <p>
          {typingUser} is typing...
        </p>
      )}

      <input
        type="text"
        placeholder="Enter message"
        value={message}
        onChange={(e) => {

          setMessage(
            e.target.value
          );

          socket?.emit(
            "typing",
            selectedRoom?._id
          );

          if (typingTimeout) {

            clearTimeout(
              typingTimeout
            );

          }

          const timeout =
            setTimeout(() => {

              socket?.emit(
                "stop_typing",
                selectedRoom?._id
              );

            }, 1000);

          setTypingTimeout(
            timeout
          );

        }}
      />

      <button onClick={sendMessage}>
        Send
      </button>

      <div>

        {messages.map(
          (msg, index) => (

            <div key={msg._id}>

              <strong>
                {msg.user}
              </strong>

              : {msg.message}

              {" "}

              {msg.isRead
                ? "✓✓ Read"
                : "✓ Sent"}

            </div>

          )
        )}

      </div>

    </div>
  );
};

export default ChatRoom;