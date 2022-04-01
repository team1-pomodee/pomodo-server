import express from "express"
const app = express()
import * as http from "http"
const server = http.createServer(app)
import { Server } from "socket.io"

import cors from "cors"

import dotenv from "dotenv"
dotenv.config()

import "express-async-errors"

// database
import connectDB from "./db/connect.js"

// router
import authRouter from "./routes/authRoutes.js"
import requestRouter from "./routes/requestRouter.js"
import friendRouter from "./routes/friendRoutes.js"

// middleware
import notFoundMiddleware from "./middleware/not-found.js"
import errorHandlerMiddleware from "./middleware/error-handler.js"
import { Room } from "./classes/RoomClass.jsx"

app.use(cors())
app.options('*', cors())
app.use(express.json())
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

const port = process.env.PORT || 3000

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET, POST, OPTIONS, PUT, PATCH, DELETE"],
  },
})

app.get("/", (req, res) => {
  res.send("Welcome to pomodee server")
})
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/request", requestRouter)
app.use("/api/v1/friend", friendRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)



const rooms = {}
const allRoomUsers = {}




io.on("connection", (socket) => {
  console.log("a user connected")

  socket.on("disconnect", () => {
    let roomName = allRoomUsers[socket.id];
    let pomodeeRoom = rooms[roomName];
    pomodeeRoom.removeUser(socket.id)
    console.log("disconnected")
  });

  socket.on("join room", (user) => {

    if (user.roomName) {
      socket.join(user.roomName)
      const pomodeeRoom = rooms[user.roomName] || new Room(socket);
      pomodeeRoom.setRoomName(user.roomName);
      allRoomUsers[socket.id] = user.roomName;
      
      if (pomodeeRoom.getRoomName() === user.roomName) {
        pomodeeRoom.setJoiningUsers(user);
        setTimeout(() => {
          // in case the user list update is not reflected in the client
          pomodeeRoom.sendSignalsToAllUsers();
        }, 2000)
      }
       
      console.log(
        `${user.username} has joined the ${user.roomName} room`,
        users.length
      )
    }
  });


  socket.on("action", ({ msg, roomName }) => {
    let pomodeeRoom = rooms[roomName];
    
    if (msg === 'pause') {
      pomodeeRoom.pause();
    }

    if (msg === 'play') {
      pomodeeRoom.play();
    }

    if (msg === 'stop') {
      pomodeeRoom.close();
    }

    if (msg === 'reset') {
      pomodeeRoom.reset();
    }
  });

  socket.on("admin", (user) => {
    let pomodeeRoom = rooms[user.roomName];
    pomodeeRoom.setAdmin(user);
  })

})



const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    server.listen(port, () => {
      console.log(`Server is listening to port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()

