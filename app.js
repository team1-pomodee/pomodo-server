const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
   origin: "https://pomododee.netlify.app/",
    methods: ["GET", "POST"]
}});


app.get("/", (req, res) => {
  res.status(200).send("Hello world")
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
   });
  
  socket.on('action', (msg) => {
    console.log(msg)
    handleSendSignal(msg)
  });
});

const handleSendSignal = (signal) => {
  io.emit('action', signal);
}

server.listen(process.env.PORT || 4000, () => {
  console.log('listening on *:4000');
});