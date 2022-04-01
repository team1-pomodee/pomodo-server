import express from "express"
const router = express.Router()

import {
  register,
  login,
  updateUser,
  addCycle,
  updateAvatar,
  hallOfFame,
} from "../controllers/authController.js"

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/updateUser").put(updateUser)
router.route("/updateAvatar").put(updateAvatar)
router.route("/addCycle").put(addCycle)
router.route("/hallOfFame").get(hallOfFame)

export default router
