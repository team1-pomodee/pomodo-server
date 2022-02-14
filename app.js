const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

import cors from 'cors'
import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

import 'express-async-errors';

// database
import connectDB from './db/connect.js';

// router
import authRouter from './routes/authRoutes.js';

// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';


const io = new Server(server, {
  transports : ['websocket'],
  cors: {
   origin: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : "https://pomododee.netlify.app/",
    methods: ["GET", "POST"]
}});


app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to homepage')
})
app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, console.log(`Server is listening to port ${port}`));
    } catch (error) {
        console.log(error);
    }
};
start();


io.on('connection', (socket) => {
  // destroy room if all users have left the room the room for more than 30mins
  // joins the room using room name
  // get room count and user's information from the db, receive user's ID from client
  console.log('a user connected');
  socket.on("private message", (anotherSocketId, msg) => {
    socket.to(anotherSocketId).emit("private message", socket.id, msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('action', (msg) => {
    console.log(msg);
    handleSendSignal(msg);
  });
});

const handleSendSignal = (signal) => {
  io.emit('action', signal);
};
