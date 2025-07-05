import React, { useState, useEffect, useRef } from "react";
import music from './iphone-sms-tone-original-mp4-5732.mp3'

export const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const containRef = useRef(null);

  const notification=new Audio(music);
  

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        id: Math.random(),
        room,
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
      notification.play();
    }
  };

  useEffect(() => {
    const handleReceiveMsg = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMsg);

    return () => {
      socket.off("receive_message", handleReceiveMsg);
    };
  }, [socket]);

  useEffect(() => {
    if (containRef.current) {
      containRef.current.scrollTop = containRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <div className="chat_container">
      <h1>Welcome {username}</h1>

      <div className="chat_box">
        <div className="auto-scrolling-div" ref={containRef}>
          {messageList.map((data) => (
            <div
              key={data.id}
              className="message_content"
              id={username === data.author ? "you" : "other"}
            >
              <div>
                <div
                  className="msg"
                  id={username === data.author ? "yellow" : "blue"}
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

        <div className="chat_body">
          <input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            type="text"
            placeholder="Type your message"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}> &#9658; </button>
        </div>
      </div>
    </div>
  );
};
