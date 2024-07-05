"use client";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

function Mssgbox() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState("");

  useEffect(() => {
    const socketInstance = io("http://localhost:4000");
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setSocketId(socketInstance.id);
      handle_mssg_received(`You connected with id ${socketInstance.id}`);
    });

    socketInstance.on("message_received", (message) => {
      handle_mssg_received(message);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  function handle_mssg_change(e) {
    setMessage(e.target.value);
  }
  function handle_room_change(e) {
    setRoom(e.target.value);
  }
  function handle_room() {
    if (room.trim() !== "") {
      socket.emit("room_join", room);
    } else {
      alert("Room name cannot be empty :)");
    }
  }
  function handle_mssg_sent() {
    if (message.trim() !== "") {
      socket.emit("message_sent", message, room);
      const message2 = { text: message, type: "sent" };
      setMessagesList([...messagesList, message2]);
      setMessage("");
    } else {
      alert("Message cannot be empty :)");
    }
  }

  function handle_enter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handle_mssg_sent();
    }
  }

  function handle_mssg_received(receivedMessage) {
    const newMessage = { text: receivedMessage, type: "received" };
    setMessagesList((prevMessages) => [...prevMessages, newMessage]);
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-5xl font-bold pt-2 text-center">Rooms</h1>

      <div className="w-full h-[100vh] flex flex-col justify-center items-center">
        <div className="h-[500px] w-[800px] border border-black rounded-md">
          <div className="h-[460px] w-[800px] overflow-y-auto p-4">
            {messagesList.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-md ${
                  msg.type === "received" ? "bg-blue-200" : "bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <span className="pt-[13px] flex items-center justify-center">
            <input
              type="text"
              placeholder="Enter message...."
              className="border border-slate-400 w-[760px]"
              value={message}
              onChange={handle_mssg_change}
              onKeyDown={handle_enter}
            />
            <button
              type="submit"
              className="border border-gray-400 bg-slate-300 text-sm h-[26px] w-10"
              onClick={handle_mssg_sent}
            >
              Send
            </button>
          </span>
        </div>

        <div className="flex space-x-5 py-3">
          <input
            type="text"
            placeholder="Enter room name...."
            className="border border-slate-400"
          />
          <button className="border border-gray-400 bg-slate-300 rounded-md">
            Create room
          </button>
        </div>

        <div className="flex space-x-5 py-3">
          <input
            type="text"
            placeholder="Enter room name...."
            className="border border-slate-400"
            value={room}
            onChange={handle_room_change}
          />
          <button
            className="border border-gray-400 bg-slate-300 rounded-md"
            onClick={handle_room}
          >
            Join room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Mssgbox;
