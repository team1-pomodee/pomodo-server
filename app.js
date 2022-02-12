import cors from 'cors'
import express from 'express';
const app = express();

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


// SOCKET.IO starts
// Will work on this part later on
// import { Server }  from 'socket.io';
// const io = new Server(server, {
//   transports: ['websocket'],
//   cors: {
//     origin: 'https://pomododee.netlify.app/',
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });

//   socket.on('action', (msg) => {
//     console.log(msg);
//     handleSendSignal(msg);
//   });
// });

// const handleSendSignal = (signal) => {
//   io.emit('action', signal);
// };
// SOCKET.IO ends