import React, { useState } from "react";
import io from "socket.io-client";
import { Chat } from "./Chat";
import music from "./mixkit-tile-game-reveal-960.wav";

const socket = io.connect("https://chat-backend-jqtd.onrender.com");

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const notification = new Audio(music);
  const joinChat = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
      notification.play();
    }
  };

  return (
    <>
      {!showChat ? (
        <div>
          <h4 className="wlcm typewriter">
            Namaste! I’m Durgesh Kumar, and I wholeheartedly welcome you to this
            chat platform. 🙏
          </h4>

          <div className="main">
            {/* <img src="./src/ui-chat.png" className='img'/> */}

            <div className="join_room ">
              <h1>Join Chat</h1>

              <input
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter chat room"
                onChange={(e) => setRoom(e.target.value)}
              />
              <button onClick={joinChat}>Join</button>
            </div>
          </div>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </>
  );
};

export default App;
