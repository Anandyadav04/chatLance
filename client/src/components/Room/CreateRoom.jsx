import { useState } from "react";

const CreateRoom = ({
  onCreateRoom,
}) => {

  const [name, setName] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const submitHandler = (e) => {

    e.preventDefault();

    if (!name.trim())
      return;

    onCreateRoom({
      name,
      description,
    });

    setName("");
    setDescription("");

  };

  return (
    <form
      onSubmit={submitHandler}
    >

      <h3>Create Room</h3>

      <input
        type="text"
        placeholder="Room Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
      />

      <button type="submit">
        Create Room
      </button>

    </form>
  );
};

export default CreateRoom;