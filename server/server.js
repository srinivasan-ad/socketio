const io = require("socket.io")(4000, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("message_sent", (message, room) => {
    console.log("Message received from client:", message);
    // Broadcast the message to all connected clients except the sender
    if (room == "") {
      socket.broadcast.emit("message_received", message);
    } else {
      socket.to(room).emit("message_received", message);
    }
  });
  socket.on("room_join", (room) => {
    socket.join(room);
    console.log(room);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
