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

import { Room } from "./classes/RoomClass.js"

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


const deleteRoom = (roomName) => { 
  delete rooms[roomName];
}

io.on("connection", (socket) => {
  console.log("a user connected")

  socket.on("disconnect", () => {
    let roomName = allRoomUsers[socket.id];
    let pomodeeRoom = rooms[roomName];
    pomodeeRoom && pomodeeRoom.removeUser(socket.id)
    console.log("disconnected")
  });

  socket.on("join room", (user) => {
    if (user.roomName) {

      socket.join(user.roomName)
      const pomodeeRoom = rooms[user.roomName] || new Room(socket, io, deleteRoom);

      pomodeeRoom.setRoomName(user.roomName);
      allRoomUsers[socket.id] = user.roomName;
      if (pomodeeRoom.getRoomName() === user.roomName) {
        pomodeeRoom.setJoiningUsers({...user, id: socket.id});
      }

      rooms[user.roomName] = pomodeeRoom;
      console.log(`${user.username} has joined the ${user.roomName} room`);
    }
  });


  socket.on("action", ({action, roomName}) => {
    let pomodeeRoom = rooms[roomName];

    if (action === 'pause') {
      pomodeeRoom.pause();
    }

    if (action === 'play') {
      pomodeeRoom.play();
    }

    if (action === 'stop') {
      pomodeeRoom.closeRoom();
    }

    if (action === 'reset') {
      pomodeeRoom.reset();
    }
  });

  socket.on("admin", (user) => {
    let pomodeeRoom = rooms[user.roomName];
    pomodeeRoom.setAdmin(user);
  })

  socket.on("logout", ({ roomName }) => {
    let pomodeeRoom = rooms[roomName];
    console.log("i receive", roomName)
    pomodeeRoom.logout(roomName)
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

