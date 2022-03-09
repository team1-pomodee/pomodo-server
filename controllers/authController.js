import User from "../models/User.js"
import { StatusCodes } from "http-status-codes"
import bcrypt from "bcryptjs"

const register = async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    throw new Error("Please provide username, email and password.")
  }

  const pass = await bcrypt.hash(password, 10)

  try {
    User.find({ username, email }).exec(async (error, result) => {
      if (error) {
        throw new Error(error)
      } else {
        if (result.length === 0) {
          const user = await User.create({
            username,
            email,
            password: pass,
            cycles: 0,
          })
          res.status(StatusCodes.CREATED).send({
            user: {
              username: user.username,
              email: user.email,
              cycles: user.cycles,
            },
          })
        } else {
          res.status(200).json({ message: "User already exist" })
        }
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new Error("Please provide email and password.")
  }

  try {
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      throw new Error("You are trying to login with invalid credentials.")
    }

    const isPasswordCorrect = await user.comparePasswords(password)

    if (!isPasswordCorrect) {
      throw new Error("You are trying to login with invalid credentials.")
    }

    user.password = undefined
    const token = user.createJWT()

    res.status(StatusCodes.OK).json({ user, token })
  } catch (error) {
    throw new Error(error)
  }
}

const updateUser = async (req, res) => {
  const { username, cycles } = req.body
  const user = await User.findOne({ username })
  const updated = await user.update({ cycles })
  res.send(`${updated}`)
}

export { register, login, updateUser }
