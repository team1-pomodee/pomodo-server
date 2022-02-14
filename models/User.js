import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email.',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minLength: 6,
    maxLength: 20,
    select: false,
  },
});

UserSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt )
})

UserSchema.methods.createJWT = function() {
  return jwt.sign({userId: this._id}, 'team1-secret', {expiresIn: '30d'})
}

UserSchema.methods.comparePasswords = async function(enteredPassword) {
  const isMatched = await bcrypt.compare(enteredPassword, this.password)
  return isMatched;
}

export default mongoose.model('User', UserSchema);
