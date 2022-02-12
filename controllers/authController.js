import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please provide username, email and password.")
  }
  const user = await User.create({username, email, password});
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { username: user.username, email: user.email}, token });
};

const login = async (req, res) => {
  res.send('Login');
};
const updateUser = async (req, res) => {
  res.send('Update User');
};

export { register, login, updateUser };
