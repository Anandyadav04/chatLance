import { useEffect, useState } from "react";
import { createSocketConnection } from "../socket/socket";
import api from "../api/axios.js";
import RoomList from "../components/Room/RoomList";

const ChatRoom = () => {

  const [socket, setSocket] = useState(null);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [rooms, setRooms] = useState([]);

  const [selectedRoom, setSelectedRoom] =
    useState(null);

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
          user: msg.sender.username,
          message: msg.message,
          createdAt: msg.createdAt,
        }));

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
      selectedRoom._id
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

      <RoomList
        rooms={rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={setSelectedRoom}
      />

      <h2>
        {selectedRoom
          ? selectedRoom.name
          : "Select a room"}
      </h2>

      <input
        type="text"
        placeholder="Enter message"
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
      />

      <button onClick={sendMessage}>
        Send
      </button>

      <div>

        {messages.map(
          (msg, index) => (

            <div key={index}>
              <strong>
                {msg.user}
              </strong>
              : {msg.message}
            </div>

          )
        )}

      </div>

    </div>
  );
};

export default ChatRoom;