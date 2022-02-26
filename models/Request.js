import mongoose from 'mongoose';
import validator from 'validator';

const RequestSchema = new mongoose.Schema({
  sendersEmail: {
    type: String,
    required: [true, 'Please provide a senders email.'],
    validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email.',
    },
  },
  sendersId: {
    type: String,
    required: [true, 'Please provide a senders id.'],
  },
  roomName: {
    type: String,
    required: false,
  },
  userId: {
        type: String,
        required: [true, 'Please provide a user id.'],
  },
  username: {
      type: String,
      required: [true, 'Please provide a username.'],
  },
  requestType: {
      type: String,
      required: [true, 'Please provide a request type.'],
  },
  createdAt: {
    type: Date,
    required: [true, 'Please provide a createdAt date'],
  }
});

export default mongoose.model('Request', RequestSchema);
