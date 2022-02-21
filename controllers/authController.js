import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please provide username, email and password.")
  }
  
  const salt = await bcrypt.genSalt(10)
  password = await bcrypt.hash(password, salt )
  
  const user = await User.create({username, email, password});
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { username: user.username, email: user.email}, token });
};

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new Error('Please provide email and password.')
  }

  const user = await User.findOne({email}).select('+password')

  if (!user) {
    throw new Error('You are trying to login with invalid credentials.')
  }

  const isPasswordCorrect = await user.comparePasswords(password)

  if (!isPasswordCorrect) {
    throw new Error('You are trying to login with invalid credentials.')
  }

  user.password = undefined
  const token = user.createJWT()

  res.status(StatusCodes.OK).json({user, token})

};
const updateUser = async (req, res) => {
  res.send('Update User');
};

export { register, login, updateUser };
