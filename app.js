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
const usersList = {}
var timeRemaining = null



io.on("connection", (socket) => {
  //what happens when a user refresh and looses their room name?
  //what happens when a user disconnects
  //how do users join room

  console.log("a user connected")

  socket.on("disconnect", () => {
    const room = usersList[socket.id]
    const users = rooms[room] || []

    const onlineUsers = users.filter((data) => data.id !== socket.id)
    if (onlineUsers.length > 0) {
      rooms[room] = onlineUsers


     

      setTimeout(() => {    
        // in case the user is still in the room
        io.to(onlineUsers[0].roomName).emit("new user", onlineUsers)
      }, 2000)
      
    }

    //notify the group that the user has left
    console.log("disconnected")
  })

  socket.on("action", (msg) => {
    handleSendSignal(msg)
  })

  socket.on("time", (time) => {
    timeRemaining = time ? time.remainingTime : null;

    io.to(time.roomName).emit("time",timeRemaining)

  })



  socket.on("admin", (user) => {
    io.to(user.id).emit("control", true)

    const room = usersList[socket.id]
    const users = rooms[room] || []

    const onlineUsers = users.map((data) => {

      if (data.id === user.id) {
        io.to(user.roomName).emit("control",  data.hasControl ? false : true)
        return { ...data, hasControl: data.hasControl ? false : true, username: data.username.includes('admin') ? data.username.substring(8) : '[admin] ' + data.username }
      }else{
        return { ...data, hasControl: false }
      }
    })
    rooms[room] = onlineUsers
    io.to(onlineUsers[0].roomName).emit("new user", onlineUsers)
  })

  socket.on("join room", (user) => {

    if (user.roomName) {
      socket.join(user.roomName)
      
      const userDetails = {
        ...user,
        id: socket.id,
      }

      rooms[user.roomName] = rooms[user.roomName] || []
      const users = rooms[user.roomName] || []
      const isUserExist = users.find((data) => data.username === user.username)

    
      if (!isUserExist) {
        users.push(userDetails)
      }


      setTimeout(() => {    
        // in case the user list update is not reflected in the client
         io.to(user.roomName).emit("new user", users)
      }, 2000)
     
      usersList[socket.id] = user.roomName

      console.log(
        `${user.username} has joined the ${user.roomName} room`,
        users.length
      )
    }
  })
})

const handleSendSignal = (signal) => {
  io.to(signal.roomName).emit("action", signal.action)
}

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
