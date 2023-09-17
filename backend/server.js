const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
var cors = require("cors");
const path = require("path");
const ConnectDB = require("./config/db");
const useRoutes = require("./routes/useRoutes");
const Chatroutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const bodyparser = require("body-parser");
const { notFound, errorHandler } = require("./middleware/erroMiddleware");
const SocketIo = require("socket.io");

ConnectDB();
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the actual origin of your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(bodyparser.json());
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", useRoutes);
app.use("/api/chat", Chatroutes);
app.use("/api/message", messageRoutes);

// ------------------Deployment-----------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/chatkaro-frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname1, "chatkaro-frontend", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully");
  });
}

app.use(notFound);
app.use(errorHandler);
const server = app.listen(port, () => {
  console.log(`App started at http://localhost:${port}`);
});

const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000", // Replace with the actual origin of your frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.user) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(userData._id);
  });
});
