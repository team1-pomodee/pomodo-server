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

const port = process.env.PORT || 3000

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET, POST, OPTIONS, PUT, PATCH, DELETE"],
  },
})
const rooms = {}
const usersList = {}

app.get("/", (req, res) => {
  res.send("Welcome to pomodee server")
})
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/request", requestRouter)
app.use("/api/v1/friend", friendRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

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
      io.to(onlineUsers[0].roomName).emit("new user", onlineUsers)
    }
    console.log("disconnected")
  })

  socket.on("action", (msg) => {
    console.log(msg)
    handleSendSignal(msg)
  })

  socket.on("join room", (user) => {
    // console.log(user)
    if (user.roomName) {
      socket.join(user.roomName)
      const userDetails = {
        ...user,
        id: socket.id,
      }

      rooms[user.roomName] = rooms[user.roomName] || []
      const users = rooms[user.roomName]
      const isUserExist = users.find((data) => data.username === user.username)

      if (!isUserExist) {
        users.push(userDetails)
      }

      socket.emit("new user", users)
      usersList[socket.id] = user.roomName

      console.log(
        `${user.username} has joined the ${user.roomName} room`,
        users.length
      )
    }

    let interval
    let count = 0
    let cycles = 0

    socket.on("timer", (control) => {
      if (control.action === "START") {
        interval = setInterval(() => {
          rooms[user.roomName].count = rooms[user.roomName].count + 1
          io.to(control.roomName).emit("timer", { count, cycles })
        }, 1000)
      }

      if (control.action === "STOP") {
        clearInterval(interval)
        rooms[user.roomName].count = 0
        io.to(control.roomName).emit("timer", { count: 0, cycles: 0 })
      }

      if (control.action === "PAUSE") {
        clearInterval(interval)
        io.to(control.roomName).emit("timer", {
          count: rooms[user.roomName].count,
          cycles: 0,
        })
      }

      if (control.action === "RESET") {
        clearInterval(interval)
        io.to(control.roomName).emit("timer", { count: 0, cycles: 0 })
      }
    })
  })
})

const handleSendSignal = (signal) => {
  io.emit("action", signal)
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
