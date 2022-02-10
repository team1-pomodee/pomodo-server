const express = require('express');
const app = express();

const server = app.listen(process.env.PORT || 4000, () => {
  console.log('listening on *:4000');
});

// SOCKET.IO starts
// Will work on this part later on
const { Server } = require('socket.io');
const io = new Server(server, {
  transports: ['websocket'],
  cors: {
    origin: 'https://pomododee.netlify.app/',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');
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
// SOCKET.IO ends