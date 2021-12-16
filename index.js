import app from "./server.js";
import { MongoClient } from "mongodb";
import UserDAO from "./DAO/UserDAO.js";
import ConversationDAO from "./DAO/ConversationDAO.js";
import http from "http";
import cors from "cors";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
const url = process.env.DATABASE_URI;
const port = process.env.PORT || 5000;
MongoClient.connect(url, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .then(async (client) => {
    await UserDAO.injectDB(client);
    await ConversationDAO.injectDB(client);
    server.listen(port, () => {
      console.log("listening on port 5000....");
    });
  })
  .catch((err) => {
    console.error();
  });

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  console.log("a user connected " + id);
  socket.on("user-send-message", async (message) => {
    const { conversationID, idList, sender, text } = message;
    console.log(message);
    const result = await ConversationDAO.addMessage(
      conversationID,
      sender,
      text
    );

    idList.forEach((userID) => {
      if (userID === sender) {
        socket.emit("receive-message", {
          conversationID: conversationID,
          messageID: result._id,
          sender: sender,
          text: text,
        });
      } else {
        socket.to(userID).emit("receive-message", {
          conversationID: conversationID,
          messageID: result._id,
          sender: sender,
          text: text,
        });
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("user " + id + "disconnected");
  });
});
