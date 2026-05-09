import React, { useState } from "react";
import io from "socket.io-client";
import { Chat } from "./Chat";

import music from "./mixkit-tile-game-reveal-960.wav";

// SOCKET CONNECTION

const socket = io.connect(
"https://chat-backend-jqtd.onrender.com"
);
// const socket = io.connect(
// "http://localhost:1000"
// );


const App = () => {

// STATES

const [username, setUsername] = useState("");

const [room, setRoom] = useState("");

const [showChat, setShowChat] = useState(false);

const notification = new Audio(music);

// JOIN CHAT

const joinChat = () => {

if (username !== "" && room !== "") {

  // SEND ROOM + USERNAME

  socket.emit("join_room", {
    room,
    username,
  });

  setShowChat(true);

  notification.play();
}


};

return (


<>

  {!showChat ? (

    <div className="main">

      <div className="join_room">

        <h1>Join Chat</h1>

        <p>
          Enter same room number to connect
        </p>

        {/* USERNAME */}

        <input
          type="text"

          placeholder="Enter your name"

          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        {/* ROOM */}

        <input
          type="text"

          placeholder="Enter room number"

          onChange={(e) =>
            setRoom(e.target.value)
          }
        />

        {/* BUTTON */}

        <button onClick={joinChat}>
          Join Chat
        </button>

      </div>

    </div>

  ) : (

    <Chat
      socket={socket}
      username={username}
      room={room}
    />

  )}

</>


);
};

export default App;
