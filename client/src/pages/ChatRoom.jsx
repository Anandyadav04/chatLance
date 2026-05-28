import { useEffect, useState } from "react";

import { createSocketConnection } from "../socket/socket";

const ChatRoom = () => {

  const [socket, setSocket] = useState(null);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const roomId = "room-1";

  useEffect(() => {

    const token = localStorage.getItem("token");

    const newSocket = createSocketConnection(token);

    setSocket(newSocket);

    newSocket.on("connect", () => {

      console.log("Socket Connected");

      newSocket.emit("join_room", roomId);

    });

    // Receive messages
    newSocket.on(
      "receive_message",
      (data) => {

        console.log(data);

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

  // Send message
  const sendMessage = () => {

    if (!message.trim()) return;

    socket.emit(
      "send_message",
      {
        roomId,
        message,
      }
    );

    setMessage("");

  };

  return (
    <div>

      <h1>Chat Room</h1>

      {/* Message Input */}
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

      {/* Messages */}
      <div>

        {messages.map((msg, index) => (

          <div key={index}>

            <strong>{msg.user}</strong>: {msg.message}

          </div>

        ))}

      </div>

    </div>
  );
};

export default ChatRoom;