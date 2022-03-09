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
app.use(express.json())

const port = process.env.PORT || 3000

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET, POST, OPTIONS, PUT, PATCH, DELETE"],
  },
})

let users = []
let rooms = {}

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
    const onlineUsers = users.filter((data) => data.id !== socket.id)
    users = onlineUsers
    console.log("user disconnected")
  })

  socket.on("action", (msg) => {
    console.log(msg)
    handleSendSignal(msg)
  })

  socket.on("join room", (user) => {
    if (user.roomName) {
      socket.join(user.roomName)
      const userDetails = {
        ...user,
        id: socket.id,
        roomName: user.roomName,
      }

      const isUserExist = users.find((data) => data.username === user.username)

      if (!isUserExist) {
        rooms[user.roomName] = { room: user.roomName }
        users.push(userDetails)
        socket.emit("new user", users)
      }
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
