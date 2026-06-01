const RoomList = ({
  rooms,
  selectedRoom,
  onSelectRoom,
}) => {
  return (
    <div>

      <h2>Rooms</h2>

      {rooms.map((room) => (
        <div
          key={room._id}
          onClick={() =>
            onSelectRoom(room)
          }
          style={{
            cursor: "pointer",
            padding: "10px",
            border:
              selectedRoom?._id === room._id
                ? "2px solid green"
                : "1px solid gray",
          }}
        >
          {room.name}
        </div>
      ))}

    </div>
  );
};

export default RoomList;