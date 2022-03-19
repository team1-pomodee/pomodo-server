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
          const user = await User.create({ username, email, password: pass })
          res.status(StatusCodes.CREATED).send({
            user: {
              username: user.username,
              email: user.email,
              cycles: user.cycles,
              cycleDetail: user.cycleDetail,
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
  User.findOne({ username: username })
    .exec()
    .then((result) => {
      result.update({ cycles: cycles }).exec()
    })
    .then((result) => {
      res.send("Update User")
    })
    .catch((error) => {
      console.error(error)
    })
}

const addCycle = async (req, res) => {
  const { email, cycleData } = req.body
  User.findOne({ email: email })
    .exec()
    .then((result) => {
      result.update({ $push: { cycleDetail: cycleData } }).exec()
    })
    .then((result) => {
      res.send("Cycle added")
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}

const updateAvatar = async (req, res) => {
  const { username, avatar } = req.body
  User.findOne({ username: username })
    .exec()
    .then((result) => {
      result.update({ avatar: avatar }).exec()
    })
    .then((result) => {
      res.send({ message: "UPDATE_SUCCESSFUL", data: result })
    })
    .catch((error) => {
      throw new Error(error)
    })
}

const hallOfFame = async (req, res) => {
  User.find({}, function (err, users) {
    var userMap = {}

    users.forEach(function (user) {
      userMap[user._id] = user
    })

    res.send(userMap)
  })
    .select({ username: 1, cycles: 1 })
    .sort({ cycles: 1 })
    .limit(10)
}

export { register, updateAvatar, login, updateUser, addCycle, hallOfFame }
