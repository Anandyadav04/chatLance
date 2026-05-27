import { useEffect } from "react";

import { createSocketConnection } from "../socket/socket";

const ChatRoom = () => {

    useEffect(() => {

        const token = localStorage.getItem("token");

        const socket = createSocketConnection(token);

        socket.on("connect", () => {

            console.log("Socket Connected");

            // Join room
            socket.emit("join_room", "room-1");

        });

        // Listen for room event
        socket.on("user_joined", (data) => {

            console.log(data.message);

        });

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