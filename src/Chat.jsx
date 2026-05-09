import React, { useState, useEffect, useRef } from "react";
import music from "./iphone-sms-tone-original-mp4-5732.mp3";

export const Chat = ({ socket, username, room }) => {
const [currentMessage, setCurrentMessage] = useState("");
const [messageList, setMessageList] = useState([]);

const containRef = useRef(null);

const notification = new Audio(music);

// SEND MESSAGE

const sendMessage = async () => {
if (currentMessage.trim() !== "") {
const messageData = {
id: Math.random(),
room: room,
author: username,
message: currentMessage,


    time: new Date(Date.now()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  await socket.emit("send_message", messageData);

  setMessageList((list) => [...list, messageData]);

  setCurrentMessage("");
}


};

// RECEIVE MESSAGE

useEffect(() => {
const handleReceiveMsg = (data) => {
setMessageList((list) => [...list, data]);


  // sound only for other user
  if (data.author !== username) {
    notification.play();
  }
};

socket.on("receive_message", handleReceiveMsg);

return () => {
  socket.off("receive_message", handleReceiveMsg);
};

}, [socket]);

// AUTO SCROLL

useEffect(() => {
if (containRef.current) {
containRef.current.scrollTop =
containRef.current.scrollHeight;
}
}, [messageList]);

return ( <div className="chat_container">

  <div className="chat_layout">

    {/* SIDEBAR */}

    <div className="sidebar">

      <div className="sidebar_top">
        <h2>💬 ChatSphere</h2>

        <p>Realtime Chat App</p>
      </div>

      <div className="sidebar_users">
        <h3>🟢 Online</h3>

        <div className="user_item">
          {username}
        </div>
      </div>

      <div className="sidebar_bottom">
        <p>Room ID</p>

        <span>{room}</span>
      </div>

    </div>

    {/* CHAT AREA */}

    <div className="chat_box">

      {/* HEADER */}

      <div className="chat_header">

        <div>
          <h2>
            Welcome, {username} 👋
          </h2>

          <p>
            Room: {room}
          </p>
        </div>

      </div>

      {/* MESSAGES */}

      <div
        className="auto-scrolling-div"
        ref={containRef}
      >

        {messageList.map((data) => (
          <div
            key={data.id}
            className="message_content"
            id={
              username === data.author
                ? "you"
                : "other"
            }
          >

            <div>

              <div
                className="msg"
                id={
                  username === data.author
                    ? "yellow"
                    : "blue"
                }
              >

                <p>{data.message}</p>

              </div>

              <div className="msg_detail">

                <p>{data.author}</p>

                <p>{data.time}</p>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* INPUT AREA */}

      <div className="chat_body">

        <input
          type="text"
          placeholder="Type your message..."

          value={currentMessage}

          onChange={(e) =>
            setCurrentMessage(e.target.value)
          }

          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
        />

        <button onClick={sendMessage}>
          ➤
        </button>

      </div>

    </div>

  </div>

</div>


);
};
