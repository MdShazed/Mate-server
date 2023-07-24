const APP_PORT = process.env.PORT || 3000;
const socketIO = require("socket.io")(APP_PORT, {
  cors: {
    origin: "*",
  },
});

const connectedUsers = new Set();

socketIO.on("connection", (socket) => {
  console.log("user is connected");

  // join
  socket.on("join", (UserName) => {
    console.log(`${UserName} has joined`);
    socket.emit("welcome", `Welcome to the chat ${UserName}`);
    socket.broadcast.emit("userJoined", `${UserName} has join the chat`);

    // online users
    connectedUsers.add(UserName);
    socketIO.emit("userList", Array.from(connectedUsers));

    // disconnect

    socket.on("disconnect", () => {
      console.log(`${UserName} left`);
      connectedUsers.delete(UserName);
      socketIO.emit("userList", Array.from(connectedUsers));
      socket.broadcast.emit("userLeft", `${UserName} left`);
    });
  });

  socket.on("message", (UserName, message) => {
    socketIO.emit("sendMessage", UserName, message, `${UserName}: ${message}`);
  });
});

console.log("server is running...");
