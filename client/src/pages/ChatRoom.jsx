import { useEffect } from "react";

import { createSocketConnection } from "../socket/socket";

const ChatRoom = () => {

  useEffect(() => {

    // Get token
    const token = localStorage.getItem("token");

    // Create socket connection
    const socket = createSocketConnection(token);

    // Connection success
    socket.on("connect", () => {

      console.log("Socket Connected");

      console.log(socket.id);

    });

    // Listen for pong
    socket.on("pong", () => {

      console.log("Pong received from server");

    });

    // Send ping event
    socket.emit("ping");

    // Cleanup connection
    return () => {

      socket.disconnect();

    };

  }, []);

  return (
    <div>
      <h1>Chat Room</h1>
    </div>
  );
};

export default ChatRoom;