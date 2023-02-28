const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173/" });

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New connection", socket.id);

  //listen to a custom event
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId: socket.id });

    console.log("online users", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  //ADD new message
  socket.on("sendMessage", (message) => {
    const recipientUser = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    if (recipientUser) {
      io.to(recipientUser.socketId).emit("getMessage", message);
      io.to(recipientUser.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  //listen to disconnection from socket
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
